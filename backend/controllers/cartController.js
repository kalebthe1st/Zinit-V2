import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req,res) => {
    try {
        // CORRECT: Use the userId from the auth middleware, not req.body
        const userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        const { itemId, size } = req.body

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error adding to cart" })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        // CORRECT: Use the userId from the auth middleware
        const userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        const { itemId, size, quantity } = req.body

        cartData[itemId][size] = quantity
        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error updating cart" })
    }
}

// get user cart data
const getUserCart = async (req,res) => {
    try {
        // CORRECT: Use the userId from the auth middleware
        const userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error getting cart" })
    }
}

export { addToCart, updateCart, getUserCart }