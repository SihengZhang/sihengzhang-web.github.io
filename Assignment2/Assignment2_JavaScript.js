
const domain_name = "https://sihengzhang-571-hw2.nn.r.appspot.com";

function clear_function() {

    document.getElementById("ticker_symbol").value = "";

    if(document.getElementById("error_message")) {
        document.body.removeChild(document.getElementById("error_message"));
    }

    if(document.getElementById("content")) {
        document.body.removeChild(document.getElementById("content"));
    }
}

function search_function() {

    let symbol = document.getElementById("ticker_symbol").value;

    if(symbol === "") {
        alert("Please fill out this field!");
        return;
    }

    if(document.getElementById("content") || document.getElementById("error_message")) {
        return;
    }

    let req = new XMLHttpRequest();
    req.open("GET", domain_name + "/get_quote" + "?symbol=" + symbol, true);
    req.onload = function () {
        if (req.status >= 200 && req.status < 300) {
            let data = eval('(' + req.responseText + ')');
            if(data["Opening Price"] === 0) {
                console.log("N");
                throw_error_message();
            } else {
                console.log("Y");
                get_jsons(symbol);
            }
        } else {
            console.error("Request failed with status: " + req.status);
        }
    };
    req.send(null);
}

function get_jsons(symbol) {
    const url_list = [
        domain_name + "/get_company_profile" + "?symbol=" + symbol,
        domain_name + "/get_quote" + "?symbol=" + symbol,
        domain_name + "/get_recommendation_trends" + "?symbol=" + symbol,
        domain_name + "/get_charts" + "?symbol=" + symbol,
        domain_name + "/get_company_news" + "?symbol=" + symbol
    ]

    const requests = url_list.map(url => get_json(url));

    Promise.all(requests)
        .then(results => {
            show_content(results);
        })
        .catch(error => {console.error('Failed to fetch data:', error);});
}

function get_json(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'json';
        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                resolve(req.response);
            } else {
                reject(new Error('Request failed with status: ' + req.status));
            }
        };
        req.onerror = () => reject(new Error('Network error'));
        req.send();
    });
}

function throw_error_message() {
    if(!document.getElementById("error_message")) {
        const error_message = document.createElement('div');
        error_message.id = "error_message";
        error_message.textContent = "Error : No record has been found, please enter a valid symbol";
        document.body.appendChild(error_message);
    }
}

function show_content(results) {
    const content = document.createElement('div');
    content.id = "content";

    content.innerHTML += "<div id=\"select_bar\">\n" +
        "<button class=\"select_buttons selected\" id=\"company\">Company</button>\n" +
        "<button class=\"select_buttons\" id=\"stock_summary\">Stock Summary</button>\n" +
        "<button class=\"select_buttons\" id=\"charts\">Charts</button>\n" +
        "<button class=\"select_buttons\" id=\"latest_news\">Latest News</button>\n" +
        "<div class=\"pages\" id=\"company_page\" style=\"display:block;\"></div>\n" +
        "<div class=\"pages\" id=\"stock_summary_page\" style=\"display:none;\"></div>\n" +
        "<div class=\"pages\" id=\"charts_page\" style=\"display:none;\"></div>\n" +
        "<div class=\"pages\" id=\"latest_news_page\" style=\"display:none;\"></div>\n" +
        "</div>";
    document.body.appendChild(content);

    make_company_page(results[0]);
    make_stock_summary(results[1], results[2]);
    make_charts(results[3], results[0]['Stock Ticker Symbol']);
    make_latest_news(results[4]);

    document.getElementById("company").addEventListener('click', function() {
        document.getElementById("stock_summary").classList.remove('selected');
        document.getElementById("charts").classList.remove('selected');
        document.getElementById("latest_news").classList.remove('selected');
        this.classList.add('selected');

        document.getElementById("stock_summary_page").style.display = "none";
        document.getElementById("charts_page").style.display = "none";
        document.getElementById("latest_news_page").style.display = "none";
        document.getElementById("company_page").style.display = "block";
    });

    document.getElementById("stock_summary").addEventListener('click', function() {
        document.getElementById("company").classList.remove('selected');
        document.getElementById("charts").classList.remove('selected');
        document.getElementById("latest_news").classList.remove('selected');
        this.classList.add('selected');

        document.getElementById("company_page").style.display = "none";
        document.getElementById("charts_page").style.display = "none";
        document.getElementById("latest_news_page").style.display = "none";
        document.getElementById("stock_summary_page").style.display = "block";
    });

    document.getElementById("charts").addEventListener('click', function() {
        document.getElementById("company").classList.remove('selected');
        document.getElementById("stock_summary").classList.remove('selected');
        document.getElementById("latest_news").classList.remove('selected');
        this.classList.add('selected');

        document.getElementById("company_page").style.display = "none";
        document.getElementById("stock_summary_page").style.display = "none";
        document.getElementById("latest_news_page").style.display = "none";
        document.getElementById("charts_page").style.display = "block";
    });

    document.getElementById("latest_news").addEventListener('click', function() {
        document.getElementById("company").classList.remove('selected');
        document.getElementById("stock_summary").classList.remove('selected');
        document.getElementById("charts").classList.remove('selected');
        this.classList.add('selected');

        document.getElementById("company_page").style.display = "none";
        document.getElementById("stock_summary_page").style.display = "none";
        document.getElementById("charts_page").style.display = "none";
        document.getElementById("latest_news_page").style.display = "block";
    });




}

function make_company_page(company_profile) {

    document.getElementById("company_page").innerHTML = "<div id='company_logo'></div>" +
        "<table id='company_table'>" +
        "<tr class='top_row'><td class='left_td'>Company Name</td><td class=\"right_td\">" + company_profile['Company Name'] + "</td></tr>" +
        "<tr><td class='left_td'>Stock Ticker Symbol</td><td class=\"right_td\">" + company_profile['Stock Ticker Symbol'] + "</td></tr>" +
        "<tr><td class='left_td'>Stock Exchange Code</td><td class=\"right_td\">" + company_profile['Stock Exchange Code'] + "</td></tr>" +
        "<tr><td class='left_td'>Company Start Date</td><td class=\"right_td\">" + company_profile['Company Start Date'] + "</td></tr>" +
        "<tr><td class='left_td'>Category</td><td class=\"right_td\">" + company_profile['Category'] + "</td></tr>" +
        "</table>";
    document.getElementById("company_logo").style.backgroundImage = "url(\"" + company_profile["Company Logo"] + "\")";



}

function make_stock_summary(quote, recommendation_trends) {
    document.getElementById("stock_summary_page").innerHTML = "<table id='stock_table'>" +
        "<tr class='top_row'><td class='left_td'>Stock Ticker Symbol</td><td class=\"right_td\">" + quote['Stock Ticker Symbol'] + "</td></tr>" +
        "<tr><td class='left_td'>Trading Day</td><td class=\"right_td\">" + quote['Trading Day'] + "</td></tr>" +
        "<tr><td class='left_td'>Previous Closing Price</td><td class=\"right_td\">" + quote['Previous Closing Price'] + "</td></tr>" +
        "<tr><td class='left_td'>Opening Price</td><td class=\"right_td\">" + quote['Opening Price'] + "</td></tr>" +
        "<tr><td class='left_td'>High Price</td><td class=\"right_td\">" + quote['High Price'] + "</td></tr>" +
        "<tr><td class='left_td'>Low Price</td><td class=\"right_td\">" + quote['Low Price'] + "</td></tr>" +
        "<tr><td class='left_td'>Change</td><td class=\"right_td\" id=\"change\">" + quote['Change'] + "</td></tr>" +
        "<tr><td class='left_td'>Change Percent</td><td class=\"right_td\" id=\"change_percent\">" + quote['Change Percent'] + "</td></tr>" +
        "</table>" +
        "<div id='recommendation'>" +
        "<div id='left_text'>Strong<br>Sell</div>" +
        "<div id='strong_sell'>" + recommendation_trends["Strong Sell"] + "</div>" +
        "<div id='sell'>" + recommendation_trends["Sell"] + "</div>" +
        "<div id='hold'>" + recommendation_trends["Hold"] + "</div>" +
        "<div id='buy'>" + recommendation_trends["Buy"] + "</div>" +
        "<div id='strong_buy'>" + recommendation_trends["Strong Buy"] + "</div>" +
        "<div id='right_text'>Strong<br>Buy</div>" +
        "</div>" +
        "<div id='bottom_text'>Recommendation Trends</div>";

    if(quote['Change'] >= 0) {
        document.getElementById("change").innerHTML += "<img class=\"arrow\" src=\"img/GreenArrowUp.png\" alt=\"green\" />"
    } else {
        document.getElementById("change").innerHTML += "<img class=\"arrow\" src=\"img/RedArrowDown.png\" alt=\"red\" />"
    }

    if(quote['Change Percent'] >= 0) {
        document.getElementById("change_percent").innerHTML += "<img class=\"arrow\" src=\"img/GreenArrowUp.png\" alt=\"green\" />"
    } else {
        document.getElementById("change_percent").innerHTML += "<img class=\"arrow\" src=\"img/RedArrowDown.png\" alt=\"red\" />"
    }
}

function make_charts(charts, ticker) {

    let data_price = [];
    let data_volume = [];

    for(let i = 0; i < charts.length; i++) {
        data_price.push([charts[i]["Date"], charts[i]["Stock Price"]]);
        data_volume.push([charts[i]["Date"], charts[i]["Volume"]]);
    }

    const today = new Date();

    const date_string = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;



    Highcharts.stockChart('charts_page', {

        title: {
            text: 'Stock Price' + ' ' + ticker + ' ' + date_string
        },

        subtitle: {
            text: '<a href="https://polygon.io/" target="_blank">Source: polygon.io</a>',
            useHTML: true
        },

        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }],
            selected: 1,
            inputEnabled: false
        },

        yAxis: [{
            title: {
                text: 'Stock Price'
            },
            opposite: false
        }, {
            title: {
                text: 'Volume'
            },
            opposite: true,
            min: 0
        }],

        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                pointWidth: 5 // Set the width of each column to 20 pixels
            }
        },

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },

        series: [{
            name: 'Stock Price',
            data: data_price,
            yAxis: 0,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },{
            name: 'Volume',
            data: data_volume,
            yAxis: 1,
            type: 'column',
            color: '#555555',
            threshold: null,
        }]
    });


}

function make_latest_news(company_news) {
    for(let i = 0; i < company_news.length; i++) {
        const news_bar = document.createElement('div');
        news_bar.className = "news";

        news_bar.innerHTML = "<img class='news_img' src=\"" + company_news[i]["Image"] + "\" alt=\"image\" />" +
            "<div class='text_and_link'>" +
            "<p class='news_title'>" + company_news[i]["Title"] + "</p>" +
            "<p class='nesw_data'>" + company_news[i]["Date"] + "</p>" +
            "<a class='news_link' href=\"" + company_news[i]["Link to Original Post"] + "\">See Original Post</a>" +
            "</div>";


        document.getElementById("latest_news_page").appendChild(news_bar);
    }
}


