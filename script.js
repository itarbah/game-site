//Hide and shows each selected page
function showPage(id) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}

//Replaces forms with a thank you message
function replaceForm(id) {
    if (id == "newsletter") {
        document.getElementById("newsletter").innerHTML = "<h2>Thank you for signing up!</h2>";
    }
    if (id == "contact") {
        document.getElementById("contact").innerHTML = "<h2>Thank you for contacting us! We will reply shortly.</h2>";
    }
}

//Shows and hides filter options
function showFilters() {
    const hidFilters = document.getElementById("hid_filters")

    if (hidFilters.style.display === "none" || hidFilters.style.display === "") {
        hidFilters.style.display = "block";
    }
    else {
        hidFilters.style.display = "none"
    }
}

//Filters games in the games page
function applyFilters() {
    const games = document.querySelectorAll(".game_container"); //stores all games
    const genreVal = document.getElementById("genreVal").value; //stores the value of the filter for genre
    const platformVal = document.getElementById("platformVal").value; //stores the value of the filter for platform
    const priceRangeVal = document.getElementById("priceRangeVal").value; //stores the value of the filter for price range
    const sort = document.getElementById("sort").value; //stores the value of the filter for sort
    const searchVal = document.getElementById("search").value.toLowerCase(); //stores the value of the search
    let gameArray = Array.from(games);

    games.forEach(game => {
        let show = true;
        const allgenre = game.querySelector(".genre").textContent;
        const genre = allgenre.split(",")
        const allplatform = game.querySelector(".platform").textContent;
        const platform = allplatform.split(",")
        const price = parseFloat(game.querySelector(".price").textContent);
        const name = game.querySelector(".game_title").textContent.toLowerCase();

        //genre sorting
        if (genreVal !== "All" && !genre.includes(genreVal)) {
            show = false;
        }
        //platform sorting
        if (platformVal !== "All" && !platform.includes(platformVal)) {
            show = false;
        }
        //price range sorting
        if (priceRangeVal !== "All") {
            const [min, max] = priceRangeVal.split("-").map(Number);
            if (price < min || price > max) {
                show = false;
            }
        }
        //search by name sorting
        if (searchVal && !name.includes(searchVal)) {
            show = false;
        }

        game.style.display = show ? "" : "none";
    })

    //sort by name, price or rating
    if (sort !== "All") {
        gameArray.sort((a, b) => {
            if (sort === "name") {
                const nameA = a.querySelector(".game_title").textContent.toLowerCase();
                const nameB = b.querySelector(".game_title").textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            }

            if (sort === "price") {
                const priceA = parseFloat(a.querySelector(".price").textContent);
                const priceB = parseFloat(b.querySelector(".price").textContent);
                return priceA - priceB;
            }

            if (sort === "rating") {
                const ratingA = parseFloat(a.querySelector(".rating").textContent);
                const ratingB = parseFloat(b.querySelector(".rating").textContent);
                return ratingB - ratingA; // highest first
            }
        });

        //shows all if no sort applied
        if (genreVal == "All" && platformVal == "All" && priceRangeVal == "All") {
            showAllGames();;
        }
        else {
            //re-append sorted elements to DOM
            const gamesList = document.getElementById("gamesList");
            gameArray.forEach(game => gamesList.appendChild(game));
        }
    }
}

let gameListView = "grid";

function toggleView() {
    const gamebox = document.getElementById("gamesList")

    if (gameListView == "grid") {
        gamebox.classList.remove("grid");
        gamebox.classList.add("list");
        gameListView = "list";
    }
    else {
        gamebox.classList.remove("list");
        gamebox.classList.add("grid");
        gameListView = "grid";
    }
}

let wishlistArray = [];
//handles adding to wishlist
function wishlistClick(button) {
    const section = button.closest("section");
    const gameId = section.id;
    const gameTitle = section.querySelector("h1").textContent;
    const existingWishlist = wishlistArray.some(game => game.id === gameId);

    if (existingWishlist) {
        wishlistArray = wishlistArray.filter(game => game.id !== gameId);//removes from wishlist
        button.textContent = "Add to Wishlist";
    } else {
        wishlistArray.push({ id: gameId, title: gameTitle });//adds to wishlist
        button.textContent = "Remove from Wishlist";
    }
    wishUpdate();
}

//listens for wishlist button click
document.addEventListener("click", function (e) {
    const button = e.target.closest(".wishlist_button");
    if (!button) return; //prevent errors if not clicking wishlist button
    wishlistClick(button);
});

//shows all wishlisted games
function wishlistFilter() {
    const games = document.querySelectorAll(".game_container");
    games.forEach(game => {
        const title = game.querySelector(".game_title");
        const gametitle = title.textContent.trim().toLowerCase();
        const existingWishlist = wishlistArray.some(item => item.title.trim().toLowerCase() === gametitle);

        game.style.display = existingWishlist ? "" : "none"

    });
}

function showAllGames() {
    document.querySelectorAll(".game_container").forEach(game => game.style.display = "");
}

let cartArray = [];
//handles adding to cart
function cartClick(button) {
    const section = button.closest("section");
    const gameId = section.id;
    const gameTitle = section.querySelector("h1").textContent;
    const gamePrice = parseFloat(section.querySelector(".price").textContent);
    const existingCart = cartArray.find(game => game.id === gameId);

    if (existingCart) {
        existingCart.quantity += 1;
    }
    else {
        cartArray.push({ id: gameId, title: gameTitle, price: gamePrice, quantity: 1 });
    }
    cartUpdate();
}

//listens for cart button click
document.addEventListener("click", function (e) {
    const button = e.target.closest(".cart_button");
    if (!button) return; //prevent errors if not clicking cart button
    cartClick(button);
});

//calculates cart
function cartCalc() {
    const cart = document.getElementById("cart");
    const emptyMessage = document.getElementById("empty_cart");
    const totalDiv = document.getElementById("cart_total");
    const games = cart.querySelector(".cart_items");
    let subtotal = 0;

    //remove any previous extra items
    cart.querySelectorAll(".cart_items").forEach(ex => {
        if (ex !== games) ex.remove();
    });

    if (cartArray.length === 0) {
        emptyMessage.style.display = "";
        totalDiv.style.display = "none";
        return;
    }

    emptyMessage.style.display = "none";
    totalDiv.style.display = "block";

    cartArray.forEach((item, index) => {
        const cartItem = games.cloneNode(true);
        cartItem.style.display = "block"; //show extra games

        cartItem.querySelector(".cart_title").textContent = item.title;
        cartItem.querySelector("p span").textContent = item.price.toFixed(2);
        cartItem.querySelector(".cart_quantity").textContent = item.quantity;
        cartItem.querySelector(".item_total").textContent = (item.price * item.quantity).toFixed(2);

        //quantity buttons
        cartItem.querySelector(".increase").onclick = () => {
            item.quantity++; //adds extra game
            cartUpdate();
            cartCalc();
        };
        cartItem.querySelector(".decrease").onclick = () => {
            if (item.quantity > 1) {
                item.quantity--; //removes extra game
            } else {
                removeItem(index); //removes game entirely
                return;
            }
            cartUpdate();
            cartCalc();
        };

        //remove button to remove a game entirely regardless of its quantity
        cartItem.querySelector(".button_remove").onclick = () => {
            removeItem(index);
            cartUpdate();
        };

        //calculates before totals
        cart.insertBefore(cartItem, totalDiv);
        subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.13; //calculates tax amount
    const total = subtotal + tax; //adds tax and gets total

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

//removes games from cart
function removeItem(index) {
    cartArray.splice(index, 1);
    cartUpdate();
    cartCalc();
}

//updates cart anytime a game is added or removed
function cartUpdate() {
    const cartTotal = cartArray.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCounter").textContent = cartTotal;
}

//updates wishlist anytime a game is added or removed
function wishUpdate() {
    document.getElementById("wishCounter").textContent = wishlistArray.length;
}

//checkout removes all in cart on completion
function resetCart() {
    cartArray = [];
    cartUpdate();
    cartCalc();
}

//shows loading circle
function showLoader() {
    document.querySelector(".loader").style.display = "block";

    setTimeout(function () {
        showPage("receiptPage");
        receiptGen();
        resetCart();
    }, 3000);
}

//generates date and random number for order number
function dateGen() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${year}${month}${day}-${random}`;
}

//generates receipt
function receiptGen() {

    document.getElementById("order_num").textContent = dateGen();
    document.getElementById("order_date").textContent =
        new Date().toLocaleDateString("en-GB");
    const email = document.getElementById("email_order");
    document.getElementById("order_email").textContent = email.value;

    const items = document.querySelector(".receipt_items");
    const games = document.querySelector(".receipt_games");

    //clears any previous items
    items.innerHTML = "";
    let subtotal = 0;

    cartArray.forEach(item => {

        const receiptItem = games.cloneNode(true);
        receiptItem.style.display = "block";

        receiptItem.querySelector(".cart_title").textContent = item.title;
        receiptItem.querySelector(".price_total").textContent = item.price.toFixed(2);
        receiptItem.querySelector(".cart_quantity").textContent = item.quantity;
        receiptItem.querySelector(".item_total").textContent = (item.price * item.quantity).toFixed(2);

        items.appendChild(receiptItem);
        subtotal += Number(item.price) * Number(item.quantity); //calculates subtotal
    });

    const tax = subtotal * 0.13; //calculates tax
    const total = subtotal + tax; //calculates total

    //adds totals to the receipt
    document.getElementById("subtotalR").textContent = subtotal.toFixed(2);
    document.getElementById("taxR").textContent = tax.toFixed(2);
    document.getElementById("totalR").textContent = total.toFixed(2);
}
