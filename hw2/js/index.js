$(document).ready(function() {

    // 清空 product-list
    $('#product-list').empty();
    $('#page').hide()
    $('#newitem').hide()
    var currentpage = 1
    var items = null
    var pageCount = 20
    var pageNum
    var showItems = (n, page) => {
        if (items == null) return
        var start = (page - 1) * pageCount
        var end;
        if (page == pageNum) {
            end = n - 1;
        } else {
            end = start + pageCount - 1;
        }
        $('#product-list').empty();
        for (var i = start; i <= end; i++) {
            newItem(items[i])
        }
    }

    var newItem = (item) => {
        $img = $('<img>').attr('class', 'image').attr('src', item.image)
        $h3 = $('<h3>').attr('class', 'name').text(item.name)
        $p = $('<p>').attr('class', 'price').text('NT$ ' + item.price)

        $item = $('<div>').attr('class', 'item').append($img).append($h3).append($p)
        $col = $('<div>').attr('class', 'col-*').append($item)
        $('#product-list').append($col)
    }

    var newPage = (n, page) => {
        pageNum = (n % 20 != 0) ? Math.floor(n / 20) + 1 : n / 20
        $('#page-number').empty()
        if (currentpage == 1) {
            $la = $('<a>').attr('class', 'page-link').attr('href', '#').attr('tabindex', '-1').attr('aria-disabled', 'true').text('«')
            $lli = $('<li>').attr('class', 'page-item').addClass('disabled').append($la)
        } else {
            $la = $('<a>').attr('class', 'page-link').attr('href', '#').text('«')
            $la.on('click', function() {
                currentpage -= 1
                showItems(n, currentpage)
                ClickPage(currentpage)
            })
            $lli = $('<li>').attr('class', 'page-item').append($la)
        }


        $('#page-number').append($lli)

        // 插入分頁數字
        for (var i = 1; i <= pageNum; i++) {
            $a = $('<a>').attr('class', 'page-link').attr('href', '#').text(i)
            $a.on('click', function() {
                var p = $(this).text()
                currentpage = Number(p)
                showItems(n, currentpage)
                ClickPage(currentpage)
            })
            var strActive = ((i == page) ? ' active' : '')
            $li = $('<li>').attr('class', 'page-item' + strActive).append($a)
            $('#page-number').append($li)
        }
        if (currentpage == pageNum) {
            $ra = $('<a>').attr('class', 'page-link').attr('tabindex', '-1').attr('aria-disabled', 'true').attr('href', '#').text('»')
            $rli = $('<li>').attr('class', 'page-item').addClass('disabled').append($ra)
        } else {
            $ra = $('<a>').attr('class', 'page-link').attr('href', '#').text('»')
            $ra.on('click', function() {
                currentpage += 1
                showItems(n, currentpage)
                ClickPage(currentpage)
            })
            $rli = $('<li>').attr('class', 'page-item').append($ra)
        }

        $('#page-number').append($rli)
    }
    var ClickPage = (page) => {
        newPage(items.length, page)
    }
    $('#query').on('click', function() {
        $('#carouselExampleIndicators').hide()
        $('#newitem').hide()
        $.get('https://js.kchen.club/B05505032/query', function(response) {
            if (response) {
                // 伺服器有回傳資料
                if (response.result) {
                    $('#product-list').empty();
                    // 資料庫有回傳資料
                    items = response.items

                    // for (var i = 0; i < items.length; i++) {
                    //     newItem(items[i])
                    // }

                    // 加了分頁效果，預設顯示第一頁
                    showItems(items.lenght, 1)

                    // 顯示分頁和設定分頁的函式
                    $('#page').show()
                    newPage(items.length, 1)

                } else {
                    $('#message').text('查無相關資料')
                    $('#dialog').modal('show')
                }
            } else {
                $('#message').text('伺服器出錯')
                $('#dialog').modal('show')
            }

            console.log(response)
        }, "json")
    })
    $('#New-item').on('click', function() {
        $('#carouselExampleIndicators').show()
        $('#submit').on('click', function() {
            if ($('#name').val() != "" && $('#price').val() != "" && $('#count').val() != "" && $('#image').val() != "") {
                var data = {
                    item: {
                        name: $('#name').val(), // 產品名稱
                        price: $('#price').val(), // 產品價錢
                        count: $('#count').val(), // 庫存數量
                        image: $('#image').val(), // 產品圖片網址
                    }
                }
                $.post('https://js.kchen.club/B05505032/insert', data, function(response) {
                    if (response) {
                        // 伺服器有回應
                        if (response.result) {
                            // 資料庫有上傳資料
                            items = response.items
                            showItems(10, 1)
                        } else {
                            $('#message').text('上傳資料失敗')
                            $('#dialog').modal('show')
                        }
                    } else {
                        $('#message').text('伺服器出錯')
                        $('#dialog').modal('show')
                    }

                    console.log(response)
                }, "json")
                $('#page').hide()
                $('#carouselExampleIndicators').show()
            } else {
                window.alert("內容不能為空")
            }
        })
    })
})