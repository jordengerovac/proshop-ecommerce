import { Request, Response } from "express";
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order items");
	} else {
		const order = new Order({
			orderItems: orderItems.map((x: any) => ({
				...x,
				product: x._id,
				_id: undefined,
			})),
			user: (req as any).user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
	const orders = await Order.find({ user: (req as any).user._id });
	res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id).populate("user", "name email");
	if (order) {
		res.status(200).json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isPaid = true;
		order.paidAt = new Date();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.email_address,
		};

		const updatedOrder = await order.save();
		res.status(200).json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private
const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = new Date();

		const updatedOrder = await order.save();
		res.status(200).json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req: Request, res: Response) => {
	const orders = await Order.find({}).populate("user", "id name");
	res.status(200).json(orders);
});

export {
	addOrderItems,
	getMyOrders,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getOrders,
};
