let data = [];
let dataFilter = [];
let dataUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
// axios抓取資料初始化
function init() {
    axios.get(dataUrl)
        .then(function (response) {
            data = response.data.data;
            renderData(data);
            renderC3(data);
        });
}

init();

const list = document.querySelector(".ticketCard-area");
const searchResult = document.querySelector("#searchResult-text");
//渲染陣列資料
function renderData(ary) {
    let str = "";
    ary.forEach(function (item, index) {
        str += `<li class="ticketCard">
        <div class="ticketCard-img">
            <a href="#">
                <img src=${item.imgUrl} alt="">
            </a>
            <div class="ticketCard-region">${item.area}</div>
            <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
            <div>
                <h3>
                    <a href="#" class="ticketCard-name">${item.name}</a>
                </h3>
                <p class="ticketCard-description">
                ${item.description}
                </p>
            </div>
            <div class="ticketCard-info">
                <p class="ticketCard-num">
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                </p>
                <p class="ticketCard-price">
                    TWD <span id="ticketCard-price">${item.price}</span>
                </p>
            </div>
        </div>
    </li>`;
    })
    list.innerHTML = str;
    searchResult.textContent = `本次搜尋共 ${ary.length} 筆資料`;
}

//清單篩選器
const listFilter = document.querySelector(".regionSearch");
listFilter.addEventListener("change", function (e) {
    dataFilter.length = 0; //觸發時先清空陣列內舊的篩選資料
    data.forEach(function (item, index) {
        if (e.target.value === "全部地區") {
            dataFilter.push(item);
        } else if (e.target.value === item.area) {
            dataFilter.push(item);
        }
    })
    renderData(dataFilter);
    renderC3(dataFilter);
}
)

//新增套票
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate")
const ticketDescription = document.querySelector("#ticketDescription");
const addBtn = document.querySelector(".addTicket-btn");
const addForm = document.querySelector(".addTicket-form");

addBtn.addEventListener("click", function () {
    data.push({
        "id": Date.now(),
        "name": ticketName.value,
        "imgUrl": ticketImgUrl.value,
        "area": ticketRegion.value,
        "description": ticketDescription.value,
        "group": Number(ticketNum.value),
        "price": Number(ticketPrice.value),
        "rate": Number(ticketRate.value)
    })
    renderData(data);
    renderC3(data);
    addForm.reset();
})

//C3.js
function renderC3(aryC3) {
    //搜集資料
    let totalObj = {};
    aryC3.forEach(function (item, index) {
        if (totalObj[item.area] === undefined) {
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area]++;
        }
    })

    //整理資料
    let newData = [];
    let area = Object.keys(totalObj);
    console.log(area);
    area.forEach(function (item, index) {
        let ary = [];
        ary.push(item);
        ary.push(totalObj[item]);
        newData.push(ary);
    })

    //產生C3統計圖
    const chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: newData,
            type: 'donut',
            colors: {
                "台北": "#26C0C7",
                "台中": "#5151D3",
                "高雄": "#E68618"
            }
        },
        donut: {
            title: "套票地區比重"
        }
    });
}