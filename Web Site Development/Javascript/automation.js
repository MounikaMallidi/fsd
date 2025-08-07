var Cards=[
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":1200,
        "Season":"Winter"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":100,
        "Season":"Summer"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":200,
        "Season":"Rainy"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":900,
        "Season":"Summer"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":400,
        "Season":"winter"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":500,
        "Season":"Rainy"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":600,
        "Season":"Spring"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":50,
        "Season":"Winter"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":750,
        "Season":"Summer"
    },
    {
        "Image" :"http://127.0.0.1:5500/category1.avif",
        "Price":670,
        "Season":"Rainy"
    }
]
var Mycards=Cards.map((ele)=>{
    return(
        `<div class="card">
            <div class="image-section">
                <img src= ${ele.Image} />
            </div>
            <div class="info-section">
                <div class="price">Price:${ele.Price}</div>
                <div class="season">Season:${ele.Season}</div>
            </div>
        </div>` 
    )
})
Mycards=Mycards.join(" ");
var parent=document.getElementsByClassName('cards-parent')[0]
parent.innerHTML=Mycards;