"""Order Pydantic schemas."""

from pydantic import BaseModel


class OrderItemInput(BaseModel):
    product_id: str
    product_name: str = ""
    price: float = 0
    quantity: int = 1
    size: str | None = None
    image_url: str | None = None


class OrderCreate(BaseModel):
    delivery_address: str
    delivery_city: str = ""
    delivery_phone: str
    delivery_notes: str | None = None
    delivery_date: str | None = None
    delivery_time: str | None = None
    payment_method: str = "card"
    shipping_method: str = "standard"
    recipient_name: str = ""
    recipient_email: str | None = None
    card_message: str | None = None
    notes: str | None = None
    items: list[OrderItemInput]


class OrderItemOut(BaseModel):
    id: str
    product_id: str | None
    product_name: str
    price: float
    quantity: int
    size: str
    image_url: str


class OrderOut(BaseModel):
    id: str
    user_id: str | None
    order_number: str
    status: str
    subtotal: float
    discount: float
    promocode: str
    shipping_method: str
    shipping_cost: float
    total_amount: float
    payment_method: str
    recipient_name: str
    recipient_phone: str
    recipient_email: str
    delivery_address: str
    delivery_city: str
    delivery_date: str
    delivery_time: str
    delivery_notes: str
    card_message: str
    notes: str
    items: list[OrderItemOut]
    created_at: str | None


class OrderListResponse(BaseModel):
    orders: list[OrderOut]
    total: int
    page: int
    size: int


class OrderStatusUpdate(BaseModel):
    status: str
