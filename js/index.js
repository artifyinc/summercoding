'use strict';

var Content = {};

Content.init = function(){
    Content.dom = {
        'body': $('body'),
        'html': $('html'),
        'header': $('.header-content'),
        'buttons': $('.main-btn-obj'),
        'c_item': $('.companies-item'),
        'c_list': $('.companies-list'),
    };

    Content.loadCompanies();
    Content.drawCompanies('sum');

    Content.register();
};

Content.register = function(){
    $(Content.dom.buttons).click(Content.buttonClick);
    $(window).scroll(function(){
        if($(Content.dom.body).scrollTop() > 200 || $(Content.dom.html).scrollTop() > 200){
            Content.headerToggle(false);
        }else{
            Content.headerToggle(true);
        }
    });
};

Content.buttonClick = function(e){
    var _btn = $(e.currentTarget);

    if($(_btn).hasClass('btn-explore')){
        Content.moveTo('companies');
    }else if($(_btn).hasClass('btn-showmore')){
        Content.drawCompanies('all');
    }else if($(_btn).hasClass('btn-apply')){
        alert("APPLY?");
    }
};

Content.headerToggle = function(_state){
    if(_state){
        if(!$(Content.dom.header).hasClass('show')){
            $(Content.dom.header).removeClass('hide').addClass('show').stop().fadeIn(200);
        }
    }else{
        if(!$(Content.dom.header).hasClass('hide')){
            $(Content.dom.header).removeClass('show').addClass('hide').stop().fadeOut(230);
        }
    }
};

Content.moveTo = function(_name){
    var _page = $('.page-' + _name),
        _top = $(_page).offset().top;

    $('html, body').stop().animate({
        'scrollTop': _top
    }, 500);
};

Content.loadCompanies = function(){
    var _load = $.ajax({
        url: 'list.json',
        dataType: 'json',
        async: false
    });

    _load.done(function(data){
        var _list = data.companies,
            c_index = _list.length, t_val, r_index;

        // shuffle companies list

        while(0 != c_index){
            r_index = Math.floor(Math.random() * c_index);
            c_index -= 1;

            t_val = _list[c_index];
            _list[c_index] = _list[r_index];
            _list[r_index] = t_val;
        }

        Content.companies = _list;
    });

    _load.fail(function(){
        console.log("Companies List cannot be loaded.");
    });
};

Content.drawCompanies = function(_mode){
    var _t = $(Content.dom.c_item),
        _c = Content.companies;

    $(_t).hide();

    if(_mode == 'sum'){
        for(var i = 0; i < 3; i++){
            var _new = Content.composeData(_c[i]);

            Content.animCompanies(_new);
            $(Content.dom.c_list).append($(_new).show());
        }
    }else if(_mode == 'all'){
        $(Content.dom.buttons[1]).parent().fadeOut(150);

        for(var i = 3; i < _c.length; i++){
            var _new = Content.composeData(_c[i]);

            Content.animCompanies(_new);
            $(Content.dom.c_list).append($(_new).show());
        }
    }else{
        console.error('_mode is not valid.');
    }
};

Content.composeData = function(_c){
    var _t = $(Content.dom.c_item),
        _new = _t.clone();

    $(_new).find('.item-image-wrapper').addClass('color-' + _c.color);
    $(_new).find('.item-image-nor').attr('src', 'res/logo/' + _c.image + '_nor.png');
    $(_new).find('.item-image-sel').attr('src', 'res/logo/' + _c.image + '_sel.png');
    $(_new).find('.item-title b').html(_c.name_en);
    $(_new).find('.item-title span').html('(' + _c.name_kr + ')');
    $(_new).find('.item-desc').html(_c.desc);
    $(_new).find('.item-link').attr('href', _c.link).html(_c.link);

    return _new;
};

Content.animCompanies = function(_c){
    var _i_wrapper = $(_c).find('.item-image-wrapper'),
        _cls = _i_wrapper.attr('class'),
        _color = '#' + _cls.match(/color-(.*)/g)[0].split('-')[1],
        _img_nor = $(_c).find('.item-image-nor'),
        _img_sel = $(_c).find('.item-image-sel');

    $(_c).on('mouseenter', function(){
        var _et = 200;

        $(this).stop().animate({
            borderColor: _color,
        }, _et);
        $(_i_wrapper).stop().animate({
            backgroundColor: _color,
        }, _et);

        $(_img_nor).stop().fadeOut(_et, function(){
            $(this).hide().css('z-index', -1);
        });
        $(_img_sel).hide().css('z-index', 10).stop().fadeIn(_et);
    }).on('mouseleave', function(){
        var _lt = 250;

        $(this).stop().animate({
            borderColor: '#f0f0f0',
        }, _lt);
        $(_i_wrapper).stop().animate({
            backgroundColor: '#f2f2f2',
        }, _lt);

        $(_img_sel).stop().fadeOut(_lt, function(){
            $(this).hide().css('z-index', -1);
        });
        $(_img_nor).hide().css('z-index', 10).stop().fadeIn(_lt);
    });
};
