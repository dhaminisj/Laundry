const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");
const Cart = require("../models/cartSchema");
const laundryList = require("../models/laundryListSchema");

const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.users;
    const { laundryListId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    const laundryDetails = await laundryList.findById(laundryListId);

    //-- Check if cart Exists and Check the quantity if items -------
    if (cart) {
      let indexFound = cart.items.findIndex(
        (p) => p.laundryListId == laundryListId
      );
      //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
      if (indexFound > -1) {
        cart.items[indexFound].quantity = quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * laundryDetails.price;
        cart.items[indexFound].price = laundryDetails.price;
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, curr) => acc + curr);
      }
      //----Check if Quantity is Greater than 0 then add item to items Array ----
      else if (quantity > 0) {
        cart.items.push({
          laundryListId,
          serviceType: laundryDetails.type,
          category: laundryDetails.category,
          cloth: laundryDetails.cloth,
          quantity,
          price: laundryDetails.price,
          total: parseInt(laundryDetails.price * quantity).toFixed(2),
        });
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, curr) => acc + curr);
      }
      //----if quantity of price is 0 throw the error -------
      else {
        return res.status(400).json({
          message: "Invalid request",
        });
      }

      data = await cart.save();
    }
    //------if there is no user with a cart then it creates a new cart and then adds the item to the cart that has been created---------
    else {
      const cartData = {
        userId: userId,
        items: [
          {
            laundryListId,
            serviceType: laundryDetails.type,
            category: laundryDetails.category,
            cloth: laundryDetails.cloth,
            quantity,
            total: parseInt(laundryDetails.price * quantity),
            price: laundryDetails.price,
          },
        ],
        subTotal: parseInt(laundryDetails.price * quantity),
      };
      cart = new Cart(cartData);
      data = await cart.save();
    }

    return res.status(200).send({
      message: "Added to Basket successfully!",
      data: data,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  addItemToCart,
};
