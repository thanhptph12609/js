window.app = {
    apiUrl: "http://localhost:3000/", ///khai báo 
    getMenu: function() {

        // gửi request lên server json => danh sách của danh mục
        // từ danh sách danh mục sinh ra code html cho phần #navbar_content
        fetch(this.apiUrl + "categories")
            .then(responseData => responseData.json())
            .then(data => {
                let menuContent = data.map(function(element) {
                    return `
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="danh-muc.html?id=${element.id}">${element.name}</a>
                    </li>
                        `;
                }).join('');
                menuContent += `<li class="nav-item active">
                                <a id="menu_cart_total" class="nav-link" href="gio-hang.html"> Giỏ hàng(${this.getTotalItemOnCart()})</a>
                            </li>`;
                document.querySelector('#navbar_content').innerHTML = menuContent;
            })
    },
    getProducts: function() {
        fetch(this.apiUrl + "products?_expand=category")
            .then(responseData => responseData.json())
            .then(data => {
                console.log(data);
                let productContent = data.map(function(element) {
                    return `
                <tr>
                
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td><img src="${element.image}" style="width: 100px; height: 100px;"  class="card-img-top" alt="..."></td>
                <td>${element.category.name}</td>
                <td>${element.detail}</td>
                <td>${element.price}</td>
                <td ><a class="btn btn-primary" onclick="app.editProduct(${element.id})">Sửa</a>
                <a class="btn btn-danger" onclick="app.removeProduct(${element.id})">Xóa</a></td>
                
                        </tr>
                        `;
                }).join('');

                document.querySelector('.list-products').innerHTML = productContent;
            })
    },
    getCate: function() {
        fetch(this.apiUrl + "categories")
            .then(responseData => responseData.json())
            .then(data => {
                let category = data.map(function(element) {
                    return `
                    <option value="${element.id}">${element.name}</option>
                        `;
                }).join('');
                document.querySelector('#categoryId').innerHTML = category;
            })
    },
    getProductsfontend: function() {
        fetch(this.apiUrl + "products?_expand=category")
            .then(responseData => responseData.json())
            .then(data => {
                let productContent = data.map(function(element) {
                    return `<div class="col-4">
                            <div class="card" style="width: 100%;">
                                <img src="${element.image}" style="width: 100px; height: 100px;" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">
                                    <a href="chi-tiet.html?id=${element.id}">${element.name}</a>    
                                </h5>
                                <p class="card-text">Danh mục: ${element.category.name}</p>
                                <p class="card-text">${element.detail}</p>
                                <p class="card-text">${element.price}</p>
                                <a href="chi-tiet.html?id=${element.id}" class="btn btn-primary">Chi tiết</a>
                                <button class="btn btn-warning" onclick="app.add2Cart(${element.id}, 
                                                                                        '${element.name}', 
                                                                                        '${element.image}', 
                                                                                        ${element.price}, 
                                                                                        ${element.categoryId}, 
                                                                                        '${element.category.name}')">Thêm giỏ hàng</button>
                                </div>
                            </div>
                        </div>`;
                }).join('');
                document.querySelector('.list-products').innerHTML = productContent;
            })
    },
    getQueryStringParam: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    add2Cart: function(id, name, image, price, cateId, cate_name) {
        let cartStorage = sessionStorage.getItem('cart');
        let screenCart = null;
        if (cartStorage == null) {
            screenCart = [];
        } else {
            screenCart = JSON.parse(cartStorage);
        }

        let item = {
            id: id,
            name: name,
            image: image,
            price: price,
            cateId: cateId,
            cate_name: cate_name
        };

        let existed = screenCart.findIndex(ele => ele.id == item.id);

        if (existed == -1) {
            item.quantity = 1;
            screenCart.push(item);
        } else {
            screenCart[existed].quantity++;
        }

        sessionStorage.setItem('cart', JSON.stringify(screenCart));
        document.querySelector('a#menu_cart_total').innerText = `Giỏ hàng (${this.getTotalItemOnCart()})`;
        alert("Cập nhật sản phẩm vào giỏ hàng thành công!");
    },
    getTotalItemOnCart: function() {
        let cartStorage = sessionStorage.getItem('cart');
        let screenCart = null;
        if (cartStorage == null) {
            screenCart = [];
        } else {
            screenCart = JSON.parse(cartStorage);
        }
        let totalItem = 0;
        screenCart.forEach(element => {
            totalItem += element.quantity;
        });

        return totalItem;
    },
    addProduct: () => {
        // Xóa sản phẩm

        var name = document.getElementById("name").value;
        console.log(name);
        var image = document.getElementById("image").value;
        console.log(image);
        var detail = document.getElementById("detail").value;
        console.log(detail);
        var price = document.getElementById("price").value;
        console.log(price);
        var categoryId = document.getElementById("categoryId").value;
        console.log(categoryId);
        fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    image,
                    detail,
                    price,
                    categoryId,
                }),
            })
            .then((data) => data.json())
            .then((data) => {
                window.location.href = "admin.html";
            });
    },
    removeProduct: function(id) {
        fetch(`http://localhost:3000/products/${id}`, {
                method: 'delete'
            }).then(reponseData => reponseData.json())
            .then(data => {
                window.location.href = 'admin.html';
            })
    },
    getProductsByCategory: () => {
        // Lấy sản phẩm theo danh mục
        //   Lấy ID từ URL
        var url = new URL(location.href);
        var categoryId = url.searchParams.get("id");

        fetch(`http://localhost:3000/products?categoryId=${categoryId}`)
            .then((data) => data.json())
            .then((data) => {
                const elements = data
                    .map((e) => {
                        return ` <tr>
                        <th scope="row">${e.id}</th>
                        <td><img src="${e.image}" alt="" width="150px"></td>
                        <td>${e.name}</td>
                        <td>${e.detail}</td>
                    </tr>`;
                    })
                    .join("");
                document.getElementById("products_list").innerHTML = elements;
            });

        fetch(`http://localhost:3000/categories/${categoryId}`)
            .then((data) => data.json())
            .then((data) => {
                document.getElementById(
                    "category_name"
                ).textContent = `Danh mục: ${data.name}`;
            });
    },
    getProductDetail: () => {
        // Chi tiết sản phẩm
        //   Lấy ID từ URL
        var url = new URL(location.href);
        var productId = url.searchParams.get("id");

        // Gọi API lấy thông tin chi tiết sản phẩm
        fetch(`http://localhost:3000/products/${productId}`)
            .then((data) => data.json())
            .then((data) => {
                //   Tạo HTML (node) chi tiết sản phẩm
                const element = `<div class="col-6">
                            <img src=${data.image} width="300px" />
                        </div>
                        <div class="col-6">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Tên: <strong>${data.name}</strong></li>
                                <li class="list-group-item">Giá: <strong>${data.price}</strong></li>
                                <li class="list-group-item">Chi chiết: <strong>${data.detail}</strong></li>
                            </ul>
                        </div>`;

                // Chèn HTML vào giao diện
                document.getElementById("product_detail").innerHTML = element;
            });
    },
    getDanhmuc: function() {

        // gửi request lên server json => danh sách của danh mục
        // từ danh sách danh mục sinh ra code html cho phần #navbar_content
        fetch(this.apiUrl + "categories")
            .then(responseData => responseData.json())
            .then(data => {
                let showdm = data.map(function(element) {
                    return `
                        <tr>
                            <td>${element.id}</td>
                            <td>${element.name}</td>
                            <td ><a class="btn btn-primary" onclick="app.editCategory(${element.id})">Sửa</a>
                <a class="btn btn-danger" onclick="app.removeCategory(${element.id})">Xóa</a></td>
                
                        </tr>
                

                        `;
                }).join('');
                document.querySelector('.list-category').innerHTML = showdm;
            })
    },
    addCategory: function() {

        var name = document.querySelector('#name').value;
        console.log(name);
        fetch(this.apiUrl + "categories", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
                }),
            })
            .then(responseData => responseData.json())
            .then(data => {
                window.location.href = 'admin.html';
            })
    },
    removeCategory: function(id) {
        fetch(`http://localhost:3000/categories/${id}`, {
                method: 'delete'
            }).then(reponseData => reponseData.json())
            .then(data => {
                window.location.href = 'admin.html';
            })
    }


}