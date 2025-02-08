const posModule = {
    namespaced: true,
    state: () => ({
        cartItems: [],
        customer: null
    }),
    mutations: {
        addToCart(state, item) {
            const itemInCart = state.cartItems.find(cartItem => cartItem.id === item.id);
            if (itemInCart) {
                itemInCart.quantity++;
            } else {
                item.quantity = 1;
                state.cartItems.push(item);
            }
        },
        decreaseQuantity(state, item) {
            let cartItem = state.cartItems.find(cartItem => cartItem.id === item.id);
            cartItem.quantity -= 1;
        },
        increaseQuantity(state, item) {
            let cartItem = state.cartItems.find(cartItem => cartItem.id === item.id);
            cartItem.quantity += 1;
        },
        removeItemFromCart(state, item) {
            state.cartItems = state.cartItems.filter(cartItem => cartItem.id != item.id);
        },
        clearCart(state) {
            state.cartItems = [];
        },
        setCustomer(state, customer) {
            state.customer = customer;
        },
        removeCustomer(state) {
            state.customer = null;
        }
    }
}
export default posModule; 