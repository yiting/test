/**
 * 框选组件
 * @author YoneChen
 * 2018-11-12
 */
var _allNodes = [], _allNodeBoxes = [], _targetNodeBoxes = [];
var iframeHtml, iframeBox,iframeHtmlBox;
var _iframe,root,frameWrap,htmlWrap;
var _callback = function() {};
// 使用框选组件
/**
 * 
 * @param {HTMLElement} wrap 挂载父级
 * @param {HTMLElement} iframe 目标iframe
 * @param {Function} callback 框选选中回调方法
 */
function rectChosen(wrap,iframe,callback) {
    rectChosen_clear();
    var data = {

    }
    _allNodes = iframe.contentWindow.document.body.querySelectorAll('[isSource]');
    iframeBox = iframe.getBoundingClientRect();
    iframeHtml = iframe.contentWindow.document.firstElementChild;
    iframeHtmlBox = iframeHtml.getBoundingClientRect();
    root = createRootDom();
    frameWrap = createFrameDom(iframeBox);
    htmlWrap = createHtmlDom(iframeHtmlBox);
    var rect = createRectDom();
    wrap.appendChild(root);
    root.appendChild(rect);
    frameWrap.appendChild(htmlWrap);
    root.appendChild(frameWrap);
    root.addEventListener('mousedown',_mdHandler.bind(this,rect,data),true);
    root.addEventListener('mousemove',_mmHandler.bind(this,rect,data),true);
    root.addEventListener('mouseup',_muHandler.bind(this,rect,data),true);
    _iframe = iframe;
    _callback = callback;
    window.onresize = rectChosen_update;
}
function rectChosen_update() {
    iframeBox = _iframe.getBoundingClientRect();
    updateFrameDom(frameWrap,iframeBox);
}
// 清理框选组件
function rectChosen_clear() {
    if(root && root.parentNode) root.parentNode.removeChild(root);
}
function createRootDom() {
    var el = document.createElement('div');
    el.className='choose-rect-dom';
    el.style.position = 'absolute',
    el.style.left = '0',
    el.style.top = '0',
    el.style.width = '100%',
    el.style.height = '100%',
    el.style.zIndex = '49';
    return el;
}
function createHtmlDom(iframeHtmlBox) {
    var el = document.createElement('section');
    el.style.position = 'relative';
    el.style.width =  iframeHtmlBox.width + 'px',
    el.style.height =  iframeHtmlBox.height + 'px';
    return el;
}
function createFrameDom(iframeBox) {
    var el = document.createElement('main');
    el.style.position = 'absolute',
    el.style.left = iframeBox.left + 'px',
    el.style.top =  iframeBox.top - 60  + 'px',
    el.style.width =  iframeBox.width + 'px',
    el.style.height =  iframeBox.height + 'px';
    el.style.overflowX = 'hidden';
    el.style.overflowY = 'auto';
    el.addEventListener('scroll',function() {
        iframeHtml.scrollTop = el.scrollTop;
    });
    return el;
}
function updateFrameDom(el,iframeBox) {
    el.style.left = iframeBox.left + 'px';
    el.style.top =  iframeBox.top - 60  + 'px';
}
function createRectDom() {
    var el = document.createElement('div');
    el.style.display = 'none';
    el.style.position = 'absolute';
    el.style.borderWidth = '2px';
    el.style.borderColor = '#ddd';
    el.style.borderStyle = 'solid';
    el.style.backgroundColor = 'rgba(0,0,0,.1)';
    return el;
}
function _mdHandler(el,data,event) {
    // _targetNodes.forEach(function (node) {
    //     node.style.borderColor = '#00aadd';
    //     node.style.borderWidth = '2';
    //     node.style.borderStyle = 'none';
    // });
    _allNodeBoxes = Array.from(_allNodes)
    .map(function(node) {
        var box = node.getBoundingClientRect();
        box.id = node.getAttribute('data-id');
        box.offsetLeft = node.offsetLeft,
        box.offsetTop = node.offsetTop;
        return box;
    });
    _targetNodeBoxes = [];
    data.d = true;
    data.startX = event.clientX,
    data.startY = event.clientY;
    clearRect(el);
    htmlWrap.innerHTML = '';
}
function _mmHandler(el,data,event) {
    event.preventDefault();
    if (data.d) {
        data.moveX = event.clientX,
        data.moveY = event.clientY;
        var dx = data.moveX - data.startX;
        var dy = data.moveY - data.startY;
        data.width = Math.abs(dx),
        data.height = Math.abs(dy);
        if (dx < 0) data.left = data.startX - data.width;
        else data.left = data.startX;
        data.right = data.left + data.width;
        if (dy < 0) data.top = data.startY - data.height;
        else data.top = data.startY;
        data.bottom = data.top + data.height;
        changeRect(el,data);
        var str = '';
        htmlWrap.innerHTML = str;
        _targetNodeBoxes = chosenNodes(data,_allNodeBoxes);
        _targetNodeBoxes.forEach(function(box) {
            str += createBox(box);
        });
        htmlWrap.innerHTML = str;
        // console.log(_targetNodes.length);
        // _targetNodes.forEach(function (node) {
        //     node.style.borderColor = '#ccc';
        //     node.style.borderWidth = '1';
        //     node.style.borderStyle = 'solid';
        // });
    }
}
function createBox(box) {
    var el = `<div style="position:absolute;left:${box.offsetLeft};top:${box.offsetTop};width:${box.width};height:${box.height};border:solid 1px #ccc"></div>`
    return el;
}
function _muHandler(el,data,event) {
    if (data.d) {
        data.d = false;
    }
    clearRect(el);
    _callback(_targetNodeBoxes.map(function(nodeBox) {
        return nodeBox.id;
    }))
}
function changeRect(el,data) {
    el.style.display = 'block',
    el.style.width = data.width + 'px',
    el.style.height = data.height + 'px',
    el.style.left = data.left + 'px',
    el.style.top = data.top - 60 + 'px';
}
function clearRect(el) {
    el.style.display = 'none';
}
function chosenNodes(data,nodeBoxes) {
    var rect = {
        left: data.left > iframeBox.left ? data.left - iframeBox.left : 0,
        right: data.right < iframeBox.right ? data.right - iframeBox.left : iframeBox.right,
        top: data.top > iframeBox.top ? data.top - iframeBox.top : 0,
        bottom: data.bottom < iframeBox.bottom ? data.bottom - iframeBox.top : iframeBox.bottom
    }
    // console.log('rect',rect.top,rect.right,rect.bottom,rect.left);
    return nodeBoxes
    .filter(function(nodeBox) {
        // console.log('node',nodeBox.top,nodeBox.right,nodeBox.bottom,nodeBox.left);
        return rect.left < nodeBox.left && rect.top < nodeBox.top && nodeBox.right < rect.right && nodeBox.bottom < rect.bottom;
        // return !(rect.left > nodeBox.right || rect.top > nodeBox.bottom || nodeBox.left > rect.right || nodeBox.top > rect.bottom);
    });
}