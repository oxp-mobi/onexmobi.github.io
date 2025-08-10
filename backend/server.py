from fastapi import FastAPI, Depends, HTTPException, Request, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import structlog
import uuid
from datetime import datetime, timedelta
import asyncio
import os
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, validator
from motor.motor_asyncio import AsyncIOMotorClient
import json
from decimal import Decimal
import bcrypt
from jose import JWTError, jwt
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiohttp
from enum import Enum
import hmac
import hashlib
import re

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Configuration
class Settings:
    def __init__(self):
        self.mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/esim_myanmar")
        self.secret_key = os.getenv("SECRET_KEY", "your-super-secret-key")
        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        
        # Transactease Configuration
        self.transactease_environment = os.getenv("TRANSACTEASE_ENVIRONMENT", "UAT")
        self.merchant_user_id = os.getenv("TRANSACTEASE_MERCHANT_USER_ID")
        self.channel = os.getenv("TRANSACTEASE_CHANNEL", "eSIM Myanmar")
        
        # Dynamic API Keys based on environment
        if self.transactease_environment == "LIVE":
            self.access_key = os.getenv("TRANSACTEASE_ACCESS_KEY_LIVE")
            self.secret_key_pgw = os.getenv("TRANSACTEASE_SECRET_KEY_LIVE")
        else:
            self.access_key = os.getenv("TRANSACTEASE_ACCESS_KEY_UAT")
            self.secret_key_pgw = os.getenv("TRANSACTEASE_SECRET_KEY_UAT")
        
        # Email Configuration
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.hostinger.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.smtp_from_email = os.getenv("SMTP_FROM_EMAIL")
        self.smtp_from_name = os.getenv("SMTP_FROM_NAME", "eSIM Myanmar")
        
        # Admin Configuration
        self.admin_email = os.getenv("ADMIN_EMAIL")
        self.admin_password_hash = os.getenv("ADMIN_PASSWORD_HASH")
        
        # URLs
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        self.allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

settings = Settings()

# Database connection
client = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, database
    # Startup
    client = AsyncIOMotorClient(settings.mongo_url)
    database = client.get_default_database()
    logger.info("Connected to MongoDB")
    yield
    # Shutdown
    if client:
        client.close()
    logger.info("Disconnected from MongoDB")

app = FastAPI(
    title="eSIM Myanmar Payment Gateway",
    description="Complete eSIM Myanmar website with payment gateway integration",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "*.esim.com.mm", "*.run.app"]
)

# Security
security = HTTPBearer()

# Models
class PaymentMethod(str, Enum):
    MPU = "MPU"
    VISA_MASTERCARD = "VISA_MASTERCARD"
    UPI = "UPI"
    UABPAY = "UABPAY"
    MMQR = "MMQR"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"

class eSIMPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    data_allowance: str
    validity: str
    coverage: List[str]
    price: float
    currency: str = "MMK"
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentRequest(BaseModel):
    payment_method: PaymentMethod
    amount: float
    currency: str = "MMK"
    esim_plan_id: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    mpu_card: Optional[Dict[str, str]] = None
    mmqr_data: Optional[Dict[str, str]] = None
    uabpay_data: Optional[Dict[str, str]] = None
    card_data: Optional[Dict[str, str]] = None

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class PaymentGatewayConfig(BaseModel):
    environment: str  # "UAT" or "LIVE"
    access_key: str
    secret_key: str

# Utility Classes
class PaymentSecurity:
    def __init__(self, secret_key: str):
        self.secret_key = secret_key.encode('utf-8') if secret_key else b''
    
    def generate_signature(self, payload: Dict[str, Any]) -> str:
        if not self.secret_key:
            return ""
        sorted_payload = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        signature = hmac.new(
            self.secret_key,
            sorted_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def verify_signature(self, payload: Dict[str, Any], received_signature: str) -> bool:
        if not self.secret_key or not received_signature:
            return False
        expected_signature = self.generate_signature(payload)
        return hmac.compare_digest(expected_signature, received_signature)
    
    def create_payment_hash(self, transaction_data: Dict[str, Any]) -> str:
        if not self.secret_key:
            return ""
        hash_string = f"{transaction_data.get('merchant_user_id', '')}" \
                     f"{transaction_data.get('amount', '')}" \
                     f"{transaction_data.get('currency', '')}" \
                     f"{transaction_data.get('transaction_id', '')}" \
                     f"{settings.secret_key_pgw or ''}"
        return hashlib.sha256(hash_string.encode()).hexdigest()

# Initialize security handler
security_handler = PaymentSecurity(settings.secret_key_pgw)

class EmailService:
    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.username = settings.smtp_username
        self.password = settings.smtp_password
        self.from_email = settings.smtp_from_email
        self.from_name = settings.smtp_from_name

    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email

            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            await aiosmtplib.send(
                msg,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.username,
                password=self.password,
                use_tls=True
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

email_service = EmailService()

# Authentication functions
def create_access_token(data: Dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    payload = verify_token(credentials)
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return payload

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Routes
@app.get("/")
async def root():
    return {"message": "eSIM Myanmar Payment Gateway API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# eSIM Plans Management
@app.get("/api/esim-plans")
async def get_esim_plans():
    """Get all active eSIM plans"""
    try:
        plans_cursor = database.esim_plans.find({"active": True})
        plans = await plans_cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for plan in plans:
            plan["_id"] = str(plan["_id"])
        
        # Default plans if none exist
        if not plans:
            default_plans = [
                {
                    "id": "esim_1gb_7days",
                    "name": "Tourist 7 Days",
                    "description": "Perfect for short visits to Myanmar",
                    "data_allowance": "1GB",
                    "validity": "7 Days",
                    "coverage": ["Myanmar"],
                    "price": 15000,
                    "currency": "MMK"
                },
                {
                    "id": "esim_3gb_15days",
                    "name": "Business 15 Days",
                    "description": "Ideal for business travelers",
                    "data_allowance": "3GB",
                    "validity": "15 Days",
                    "coverage": ["Myanmar"],
                    "price": 35000,
                    "currency": "MMK"
                },
                {
                    "id": "esim_5gb_30days",
                    "name": "Explorer 30 Days",
                    "description": "Best value for extended stays",
                    "data_allowance": "5GB",
                    "validity": "30 Days",
                    "coverage": ["Myanmar"],
                    "price": 55000,
                    "currency": "MMK"
                }
            ]
            return default_plans
        
        return plans
    except Exception as e:
        logger.error(f"Failed to fetch eSIM plans: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch eSIM plans")

# Payment Processing
@app.post("/api/payments/create")
async def create_payment(payment_request: PaymentRequest, background_tasks: BackgroundTasks):
    """Create a new payment order"""
    try:
        transaction_id = f"ESIM_{int(datetime.utcnow().timestamp() * 1000)}_{uuid.uuid4().hex[:8].upper()}"
        
        # Create payment record
        payment_record = {
            "transaction_id": transaction_id,
            "merchant_user_id": settings.merchant_user_id,
            "amount": payment_request.amount,
            "currency": payment_request.currency,
            "payment_method": payment_request.payment_method.value,
            "esim_plan_id": payment_request.esim_plan_id,
            "customer_email": payment_request.customer_email,
            "customer_phone": payment_request.customer_phone,
            "status": PaymentStatus.PENDING.value,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await database.payment_transactions.insert_one(payment_record)
        
        # For demo purposes, simulate different payment flows
        response_data = {
            "success": True,
            "transaction_id": transaction_id,
            "message": "Payment order created successfully"
        }
        
        if payment_request.payment_method == PaymentMethod.MMQR:
            # Generate QR code URL (mock)
            response_data["qr_code_url"] = "https://i.ibb.co/gb53dCHM/MMQR.png"
            response_data["qr_expires_in"] = 600  # 10 minutes
        elif payment_request.payment_method == PaymentMethod.UABPAY:
            # Redirect URL for UABPay (mock)
            response_data["redirect_url"] = f"{settings.frontend_url}/payment/redirect?transaction_id={transaction_id}"
        else:
            # For card payments, redirect to payment form
            response_data["payment_url"] = f"{settings.frontend_url}/payment/form?transaction_id={transaction_id}"
        
        # Log the payment creation
        logger.info(
            "Payment order created",
            transaction_id=transaction_id,
            amount=payment_request.amount,
            payment_method=payment_request.payment_method.value
        )
        
        return response_data
        
    except Exception as e:
        logger.error(f"Failed to create payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

@app.get("/api/payments/{transaction_id}/status")
async def get_payment_status(transaction_id: str):
    """Get payment status"""
    try:
        payment = await database.payment_transactions.find_one({"transaction_id": transaction_id})
        if not payment:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {
            "transaction_id": transaction_id,
            "status": payment["status"],
            "amount": payment["amount"],
            "currency": payment["currency"],
            "payment_method": payment["payment_method"],
            "created_at": payment["created_at"],
            "updated_at": payment["updated_at"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get payment status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get payment status")

# Admin Authentication
@app.post("/api/admin/login")
async def admin_login(login_request: AdminLoginRequest):
    """Admin login endpoint"""
    try:
        if (login_request.email != settings.admin_email or 
            not verify_password(login_request.password, settings.admin_password_hash)):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        access_token = create_access_token({
            "sub": login_request.email,
            "role": "admin",
            "type": "access_token"
        })
        
        logger.info(f"Admin login successful: {login_request.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin login failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

# Admin Payment Gateway Configuration
@app.get("/api/admin/payment-gateway/config")
async def get_payment_gateway_config(admin: Dict[str, Any] = Depends(verify_admin_token)):
    """Get current payment gateway configuration"""
    try:
        return {
            "environment": settings.transactease_environment,
            "merchant_user_id": settings.merchant_user_id,
            "channel": settings.channel,
            "access_key_masked": f"{settings.access_key[:8]}..." if settings.access_key else "",
            "secret_key_masked": f"{settings.secret_key_pgw[:8]}..." if settings.secret_key_pgw else "",
            "last_updated": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Failed to get payment gateway config: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get configuration")

@app.post("/api/admin/payment-gateway/config")
async def update_payment_gateway_config(
    config: PaymentGatewayConfig,
    admin: Dict[str, Any] = Depends(verify_admin_token)
):
    """Update payment gateway configuration"""
    try:
        # Update environment variables (in production, this would update a config store)
        if config.environment not in ["UAT", "LIVE"]:
            raise HTTPException(status_code=400, detail="Environment must be UAT or LIVE")
        
        # Store configuration in database for persistence
        config_record = {
            "environment": config.environment,
            "access_key": config.access_key,
            "secret_key": config.secret_key,
            "updated_by": admin["sub"],
            "updated_at": datetime.utcnow()
        }
        
        await database.payment_gateway_configs.replace_one(
            {"active": True},
            {**config_record, "active": True},
            upsert=True
        )
        
        # Update runtime settings
        settings.transactease_environment = config.environment
        settings.access_key = config.access_key
        settings.secret_key_pgw = config.secret_key
        
        # Reinitialize security handler
        global security_handler
        security_handler = PaymentSecurity(config.secret_key)
        
        logger.info(
            f"Payment gateway configuration updated",
            environment=config.environment,
            updated_by=admin["sub"]
        )
        
        return {
            "success": True,
            "message": "Configuration updated successfully",
            "environment": config.environment,
            "updated_at": datetime.utcnow()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update payment gateway config: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update configuration")

# Admin Dashboard Data
@app.get("/api/admin/dashboard")
async def get_admin_dashboard(admin: Dict[str, Any] = Depends(verify_admin_token)):
    """Get admin dashboard data"""
    try:
        # Payment statistics
        total_payments = await database.payment_transactions.count_documents({})
        completed_payments = await database.payment_transactions.count_documents({"status": "COMPLETED"})
        pending_payments = await database.payment_transactions.count_documents({"status": "PENDING"})
        failed_payments = await database.payment_transactions.count_documents({"status": "FAILED"})
        
        # Recent transactions
        recent_transactions = await database.payment_transactions.find().sort("created_at", -1).limit(10).to_list(10)
        
        # Convert ObjectIds to strings
        for transaction in recent_transactions:
            transaction["_id"] = str(transaction["_id"])
        
        return {
            "statistics": {
                "total_payments": total_payments,
                "completed_payments": completed_payments,
                "pending_payments": pending_payments,
                "failed_payments": failed_payments,
                "success_rate": (completed_payments / total_payments * 100) if total_payments > 0 else 0
            },
            "recent_transactions": recent_transactions,
            "current_environment": settings.transactease_environment
        }
    except Exception as e:
        logger.error(f"Failed to get admin dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load dashboard data")

# Mock eSIM Provisioning
@app.post("/api/esim-mock/provision")
async def mock_esim_provision(provisioning_data: Dict[str, Any]):
    """Mock eSIM provisioning endpoint"""
    try:
        # Simulate eSIM provisioning
        provisioning_id = f"PROV_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:8]}"
        
        # Create eSIM details (mock)
        esim_details = {
            "provisioning_id": provisioning_id,
            "transaction_id": provisioning_data.get("transaction_id"),
            "esim_plan_id": provisioning_data.get("esim_plan_id"),
            "iccid": f"8995{random.randint(1000000000000000, 9999999999999999)}",
            "activation_code": f"LPA:1$rsp-prod.esim.com.mm${uuid.uuid4().hex}",
            "qr_code_url": f"https://i.ibb.co/xtnDfgZy/esim.jpg",
            "status": "PROVISIONED",
            "provisioned_at": datetime.utcnow()
        }
        
        await database.esim_provisions.insert_one(esim_details)
        
        # Send email with eSIM details if customer email provided
        if provisioning_data.get("customer_email"):
            await email_service.send_email(
                provisioning_data["customer_email"],
                "Your eSIM is Ready!",
                f"""
                <h2>Your eSIM has been successfully provisioned!</h2>
                <p>Transaction ID: {provisioning_data.get('transaction_id')}</p>
                <p>ICCID: {esim_details['iccid']}</p>
                <p>Activation Code: {esim_details['activation_code']}</p>
                <p>Scan the QR code to activate your eSIM:</p>
                <img src="{esim_details['qr_code_url']}" alt="eSIM QR Code" style="max-width: 300px;">
                <p>Thank you for choosing eSIM Myanmar!</p>
                """
            )
        
        logger.info(f"eSIM provisioned: {provisioning_id}")
        return esim_details
        
    except Exception as e:
        logger.error(f"Failed to provision eSIM: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to provision eSIM")

# Webhook endpoint for payment status updates
@app.post("/api/webhooks/payment-status")
async def payment_status_webhook(request: Request):
    """Handle payment status webhook from Transactease"""
    try:
        payload = await request.json()
        signature = request.headers.get("X-Signature", "")
        
        # Verify webhook signature
        if not security_handler.verify_signature(payload, signature):
            logger.error("Invalid webhook signature")
            raise HTTPException(status_code=401, detail="Invalid signature")
        
        transaction_id = payload.get("transaction_id")
        new_status = payload.get("status")
        
        if not transaction_id or not new_status:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Update payment status
        await database.payment_transactions.update_one(
            {"transaction_id": transaction_id},
            {
                "$set": {
                    "status": new_status,
                    "updated_at": datetime.utcnow(),
                    "gateway_response": payload
                }
            }
        )
        
        # If payment completed, trigger eSIM provisioning
        if new_status == "COMPLETED":
            payment = await database.payment_transactions.find_one({"transaction_id": transaction_id})
            if payment:
                # Mock eSIM provisioning call
                await mock_esim_provision({
                    "transaction_id": transaction_id,
                    "esim_plan_id": payment["esim_plan_id"],
                    "customer_email": payment.get("customer_email"),
                    "amount_paid": payment["amount"],
                    "currency": payment["currency"]
                })
        
        logger.info(f"Webhook processed: {transaction_id} -> {new_status}")
        return {"success": True, "message": "Webhook processed"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# Contact form submission
@app.post("/api/contact")
async def submit_contact_form(contact_data: Dict[str, Any]):
    """Handle contact form submission"""
    try:
        # Store contact submission
        contact_record = {
            **contact_data,
            "submitted_at": datetime.utcnow(),
            "status": "NEW"
        }
        
        await database.contact_submissions.insert_one(contact_record)
        
        # Send notification email to admin
        if settings.smtp_from_email:
            await email_service.send_email(
                settings.admin_email or settings.smtp_from_email,
                f"New Contact Form Submission - {contact_data.get('subject', 'No Subject')}",
                f"""
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> {contact_data.get('name', 'N/A')}</p>
                <p><strong>Email:</strong> {contact_data.get('email', 'N/A')}</p>
                <p><strong>Phone:</strong> {contact_data.get('phone', 'N/A')}</p>
                <p><strong>Subject:</strong> {contact_data.get('subject', 'N/A')}</p>
                <p><strong>Message:</strong></p>
                <p>{contact_data.get('message', 'N/A')}</p>
                <p><strong>Submitted:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                """
            )
        
        logger.info("Contact form submitted", email=contact_data.get('email'))
        return {"success": True, "message": "Thank you for your message. We'll get back to you soon!"}
        
    except Exception as e:
        logger.error(f"Failed to process contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)