/* ============================================================
   中国精算师考试知识库 · 交互脚本（可复用骨架）
   功能：①学习进度记忆(localStorage) ②顶部滚动进度条 ③回到顶部
        ④模拟卷「展开/收起全部答案」 ⑤演算器框架
   新科目只需改 KEY 与 TOTAL，并在各页 data-id 处填唯一标识。
   ============================================================ */
(function(){
  'use strict';
  /* ====== 配置：每套库改这两处 ====== */
  var KEY  = 'ML-KB-PROGRESS';              // localStorage 键名（唯一）
  var TOTAL = 7;                       // 计入进度的学习页总数（首页/品牌页不计入）

  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
  function save(o){localStorage.setItem(KEY,JSON.stringify(o))}

  /* ---------- ① 学习进度记忆 ---------- */
  var p=load();
  document.querySelectorAll('.done-btn').forEach(function(b){
    var id=b.getAttribute('data-id');
    if(p[id]){b.classList.add('did');b.textContent='✓ 已完成（点击撤销）'}
    b.addEventListener('click',function(){
      p=load();
      if(p[id]){delete p[id];b.classList.remove('did');b.textContent='○ 标记本页已完成'}
      else{p[id]=Date.now();b.classList.add('did');b.textContent='✓ 已完成（点击撤销）'}
      save(p);renderMini();
    });
  });
  function renderMini(){
    var m=document.querySelector('.side .prog-mini b');
    if(m){var n=Object.keys(load()).length;m.textContent=n+' / '+TOTAL}
  }
  renderMini();

  /* ---------- ② 顶部滚动进度条 ---------- */
  var bar=document.createElement('div');
  bar.style.cssText='position:fixed;top:0;left:0;height:3px;background:#EF9F27;z-index:99;transition:width .1s';
  document.body.appendChild(bar);

  /* ---------- ③ 回到顶部 ---------- */
  var top=document.createElement('button');
  top.className='back-top';top.textContent='↑';top.title='回到顶部';
  document.body.appendChild(top);
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  window.addEventListener('scroll',function(){
    var h=document.documentElement;
    var w=(h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
    bar.style.width=Math.min(100,Math.max(0,w))+'%';
    if(h.scrollTop>600){top.classList.add('show')}else{top.classList.remove('show')}
  });

  /* ---------- ④ 模拟卷：展开/收起全部答案 ---------- */
  document.querySelectorAll('.js-toggle-answers').forEach(function(btn){
    btn.addEventListener('click',function(){
      var boxes=document.querySelectorAll('details.answer');
      var anyClosed=false;
      boxes.forEach(function(d){if(!d.open)anyClosed=true});
      boxes.forEach(function(d){d.open=anyClosed});
      btn.textContent=anyClosed?'收起全部答案':'展开全部答案';
    });
  });

  /* ---------- ⑤ 演算器框架 ----------
     约定：每个演算器外层容器 id="calc-xxx"，内部输入含 class="calc-in"，
     输出含 class="calc-out"（可多个），点「计算」按钮或输入即触发 run()。
     run() 由具体页面内联扩展；此处仅提供通用绑定与取值工具。 */
  function $(id){return document.getElementById(id)}
  function num(el){var v=parseFloat(el.value);return isNaN(v)?0:v}
  function fmt(x,d){if(!isFinite(x))return '—';return x.toLocaleString('zh-CN',{minimumFractionDigits:d||2,maximumFractionDigits:d||2})}

  document.querySelectorAll('.calc').forEach(function(box){
    var run=box.__run;                  // 若页面定义了 box.__run 则用；否则占位
    function trigger(){ if(typeof box.__run==='function') box.__run(); }
    box.querySelectorAll('.calc-in').forEach(function(el){el.addEventListener('input',trigger)});
    var runBtn=box.querySelector('.calc-run');
    if(runBtn)runBtn.addEventListener('click',trigger);
  });
})();
