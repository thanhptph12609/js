window.app = {
    apiUrl: "http://localhost:3000/",
    getMenu: function(){
        
        // gửi request lên server json => danh sách của danh mục
        // từ danh sách danh mục sinh ra code html cho phần #navbar_content
        fetch(this.apiUrl + "categories")
        .then(responseData => responseData.json())
        .then(data => {
            let menuContent = data.map(function(element){
                return `<li class="nav-item active">
                            <a class="nav-link" href="danh-muc.html?id=${element.id}"> ${element.name} </a>
                        </li>`; 
            }).join('');
            document.querySelector('#navbar_content').innerHTML = menuContent;
        })
    },
    getProducts: function(){
        fetch(this.apiUrl + "products?_expand=category")
        .then(responseData => responseData.json())
        .then(data => {
            let productContent = data.map(function(element){
                return `<div class="col-4">
                            <div class="card" style="width: 100%;">
                                <img src="${element.image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">
                                    <a href="chi-tiet.html?id=${element.id}">${element.name}</a>    
                                </h5>
                                <p class="card-text">Danh mục: ${element.category.name}</p>
                                <p class="card-text">${element.detail}</p>
                                <p class="card-text">${element.price}</p>
                                <a href="chi-tiet.html?id=${element.id}" class="btn btn-primary">Chi tiết</a>
                                </div>
                            </div>
                        </div>`; 
            }).join('');
            document.querySelector('.list-products').innerHTML = productContent;
        })
    },
    getQueryStringParam: function(name){
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
}