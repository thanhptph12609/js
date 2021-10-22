window.app = {
  getMenuFromCategories: () => {
    // Gọi menu từ category
    fetch("http://localhost:3000/categories")
      .then((data) => data.json())
      .then((data) => {
        const elements = data
          .map((e) => {
            return `<a class="nav-link" href="/danh-muc.html?id=${e.id}">${e.name}</a>`;
          })
          .join("");
        document.getElementById("list_categories").innerHTML = elements;
      });
  },
  getCategoriesOptions: () => {
    // Gọi option từ category
    fetch("http://localhost:3000/categories")
      .then((data) => data.json())
      .then((data) => {
        const elements = data
          .map((e) => {
            return `<option value="${e.id}">${e.name}</option>`;
          })
          .join("");
        document.getElementById("categoryId").innerHTML = elements;
      });
  },
  getProducts: () => {
    // Lấy tất cả danh sách sản phẩm
    fetch("http://localhost:3000/products")
      .then((data) => data.json())
      .then((data) => {
        const elements = data
          .map((e) => {
            return `<tr>
                        <th scope="row">${e.id}</th>
                        <td><img src="${e.image}" alt="" width="150px"></td>
                        <td>${e.name}</td>
                        <td>${e.detail}</td>
                        <td>
                          <a href="/chi-tiet.html?id=${e.id}" class="btn btn-primary">Chi tiết<a>
                          <button class="btn btn-danger" onclick="app.deleteProduct(${e.id})">Xóa</button>
                        </td>
                    </tr>`;
          })
          .join("");
        document.getElementById("products_list").innerHTML = elements;
      });
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
                        <td><a href="/chi-tiet.html?id=${e.id}" class="btn btn-primary">Chi tiết<a></td>
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
  searchProduct: () => {
    // Tìm kiếm sản phẩm theo tên
    // Lấy giá trị từ ô input
    var searchInput = document.getElementById("search-input");

    // Gọi API tìm kiếm sản phẩm theo tên
    fetch(`http://localhost:3000/products?name_like=${searchInput.value}`)
      .then((data) => data.json())
      .then((data) => {
        //   Tạo HTML (node) chi tiết sản phẩm
        const elements = data
          .map((e) => {
            return `<tr>
                        <th scope="row">${e.id}</th>
                        <td><img src="${e.image}" alt="" width="150px"></td>
                        <td>${e.name}</td>
                        <td>${e.detail}</td>
                        <td>
                          <a href="/chi-tiet.html?id=${e.id}" class="btn btn-primary">Chi tiết<a>
                          <button class="btn btn-danger" onclick="app.deleteProduct(${e.id})">Xóa</button>
                        </td>
                    </tr>`;
          })
          .join("");
        document.getElementById("products_list").innerHTML = elements;
      });
  },
  deleteProduct: (id) => {
    // Xóa sản phẩm
    var confirmDelete = confirm("Muốn xóa thật ko?");

    if (confirmDelete === true) {
      // Gọi API xóa sản phẩm
      fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      })
        .then((data) => data.json())
        .then((data) => {
          this.getProducts();
          console.log(data);
        });
    }
  },
  saveProduct: () => {
    // Xóa sản phẩm
    var name = document.getElementById("name").value;
    var image = document.getElementById("image").value;
    var detail = document.getElementById("detail").value;
    var price = document.getElementById("price").value;
    var categoryId = document.getElementById("categoryId").value;

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
        window.location.href = "/";
      });
  },
  createCategory: () => {
    var categoryName = prompt("Nhập tên danh mục");
    fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        this.getMenuFromCategories();
      });
  },
};
