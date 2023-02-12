document.addEventListener("DOMContentLoaded", () => {
    setRangeVal('.storage', '.stor_val');
    setRangeVal('.transfer', '.transfer_val');

    document.querySelectorAll('input[type=range]').forEach(element => {
        element.addEventListener('change', () => {
            setRangeVal('.storage', '.stor_val');
            setRangeVal('.transfer', '.transfer_val');
            backblazeGraph();
            bunnyGraph();
            scalewayGraph();
            vultrGraph();
            setMinColor();
        })
    });
    document.querySelectorAll('input[type=radio]').forEach(element => {
        element.addEventListener('change', () => {
            bunnyGraph();
            scalewayGraph();
            setMinColor();
        })
    });

    backblazeGraph();
    bunnyGraph();
    scalewayGraph();
    vultrGraph();
    setMinColor();
})

const priceList = {
    backblaze: {
        minPrice: 7,
        storage: 0.005,
        transfer: 0.01,
    },
    bunny: {
        maxPrice: 10,
        storage: {
            hdd: 0.01,
            ssd: 0.02
        },
        transfer: {
            hdd: 0.01,
            ssd: 0.01
        }
    },
    scaleway: {
        maxSize: 75,
        storage: {
            multi: 0.06,
            single: 0.03,
        },
        transfer: {
            multi: 0.02,
            single: 0.02,
        }
    },
    vultr: {
        minPrice: 5,
        storage: 0.01,
        transfer: 0.01,
    },
}
let backblaze = 0, 
    bunny = 0,
    scaleway = 0, 
    vultr = 0;

function backblazeGraph() {
    let storage = document.querySelector('.storage').value;
    let transfer = document.querySelector('.transfer').value;
    let price = storage * priceList.backblaze.storage + priceList.backblaze.transfer * transfer;
    if (price <= priceList.backblaze.minPrice) {
        price = priceList.backblaze.minPrice;
    }
    let width = document.querySelector('.graph_bar.backblaze .bar').offsetWidth;
    document.querySelector('.graph_bar.backblaze .value span').innerHTML = Math.round(price);
    document.querySelector('.graph_bar.backblaze .bar .line').style.width = (width/100)*price + 'px';
}

function bunnyGraph() {
    let storage = document.querySelector('.storage').value;
    let transfer = document.querySelector('.transfer').value;
    let radio = document.querySelectorAll('.bunny .radio-group input');
    radio.forEach(element => {
        if (element.checked  == true) {
            let type = element.id;
            // console.log(type)
            let price = storage * priceList.bunny.storage[type] + priceList.bunny.transfer[type] * transfer;
            if (price >= priceList.bunny.maxPrice) {
                price = priceList.bunny.maxPrice;
            }
            let width = document.querySelector('.graph_bar.bunny .bar').offsetWidth;
            document.querySelector('.graph_bar.bunny .value span').innerHTML = price;
            document.querySelector('.graph_bar.bunny .bar .line').style.width = (width/100)*price + 'px';
        }
    });
}

function scalewayGraph() {
    let storage = document.querySelector('.storage').value;
    let transfer = document.querySelector('.transfer').value;
    let radio = document.querySelectorAll('.scaleway .radio-group input');
    radio.forEach(element => {
        if (element.checked  == true) {
            let type = element.id;
            let sPrice = 0;
            if (storage <= priceList.scaleway.maxSize) {
                sPrice = 0;
            } else {
                sPrice = (storage - priceList.scaleway.maxSize) * priceList.scaleway.storage[type];
            }
            let tPrice = 0;
            if (transfer <= priceList.scaleway.maxSize) {
                tPrice = 0;
            } else {
                tPrice = (transfer - priceList.scaleway.maxSize) * priceList.scaleway.transfer[type];
            }
            let price = sPrice + tPrice;

            let width = document.querySelector('.graph_bar.scaleway .bar').offsetWidth;
            document.querySelector('.graph_bar.scaleway .value span').innerHTML = price;
            document.querySelector('.graph_bar.scaleway .bar .line').style.width = (width/100)*price + 'px';
        }
    });
}

function vultrGraph() {
    let storage = document.querySelector('.storage').value;
    let transfer = document.querySelector('.transfer').value;
    let price = storage * priceList.vultr.storage + priceList.vultr.transfer * transfer;
    if (price <= priceList.vultr.minPrice) {
        price = priceList.vultr.minPrice;
    }
    let width = document.querySelector('.graph_bar.vultr .bar').offsetWidth;
    document.querySelector('.graph_bar.vultr .value span').innerHTML = Math.round(price);
    document.querySelector('.graph_bar.vultr .bar .line').style.width = (width/100)*price + 'px';
}

function setRangeVal(a, b) {
    let r = document.querySelector(a).value;
    document.querySelector(b).innerHTML = r;   
}

function setMinColor() {
    let lines = document.querySelectorAll('.line'),
        min = lines[0];
    lines.forEach(element => {
        element.style.backgroundColor = "gray";
        if (element.offsetWidth <= min.offsetWidth) {
            min = element;
        }
    });
    min.style.backgroundColor = "red";
    // for (let i = 1; i < lines.length; ++i) {
    //     if (lines[i] > max) {
    //         max = lines[i];
            
    //     }
    //     if (lines[i] < min) {
    //         min = lines[i];
    //         console.log(lines[i])
    //     }
    //     // console.log('min = ',min)
    //     // console.log('max = ', max)
    // }
}