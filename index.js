const svg = d3.select('body').append('svg')
  .attr('viewBox', '0 0 100 100');

const sel = svg.selectAll('g').data(Array.from(Array(9), (_, i) => ({x: i % 3, y: Math.floor(i / 3)})));

const [width, height] = [100, 100];
const [w, h] = [width, height].map(v => v / 3);
const enter = sel.enter().append('g')
  .attr('transform', d => `translate(${d.x * w},${d.y * h})`);

let last = null;

function positionText(t) {
  t.attr('x', w / 2).attr('y', h / 2).attr('text-anchor', 'middle').attr('alignment-baseline', 'middle');
}

function styleText(sel, text) {
  sel.attr('fill', text == 'X' ? 'red' : 'blue').text(text);
}

function next() {
  return last = last == 'X' ? 'O' : last == 'O' ? null : 'X';
}

enter.append('rect')
  .attr('fill', 'white')
  .attr('stroke', 'black')
  .attr('width', 100 / 3).attr('height', 100 / 3)
  .on('click', function(e) {
    const s = d3.select(this.parentNode);
    const t = s.select('text');
    last = last == 'X' ? 'O' : t.empty() ? 'X' : null;
    if (last == null) {
      t.remove();
    } else {
      styleText(t.empty() ? s.append('text').call(positionText) : t, last);
    }
    check();
    d3.event.preventDefault();
  });
  

function threeInARow(arr) {
  for (let i = 0; i < 3; i++) {
    for (let key of ['x', 'y']) {
      const sub = arr.filter(v => v[key] == i);
      if (sub.length == 3) {
        return sub;
      }
    }
  }
  return null;
}

function diag(arr) {
  let sub = arr.filter(v => v.x == v.y);
  if (sub.length == 3) {
    return sub;
  }
  sub = arr.filter(v => 2 - v.x == v.y);
  if (sub.length == 3) {
    return sub;
  }
  return null;
}

function unsetStyle(sel) {
  sel.select('rect').attr('fill', 'white');
}

function setStyle(sel) {
  sel.select('rect').attr('fill', 'orange');
}
  
function check() {
  const xs = [], os = [];
   svg.selectAll('g')
     .call(unsetStyle)
     .filter(function() {
       const s = d3.select(this).select('text')
       return !s.empty() && s.text() != null;
     })
     .each(function(d) {
       const val = d3.select(this).select('text').text();
       (val == 'X' ? xs : os).push(d);
     });
   
   const found = threeInARow(xs) || threeInARow(os) || diag(xs) || diag(os);
   if (found) {
     svg.selectAll('g').filter(d => found.find(v => v.x == d.x && v.y == d.y)).call(setStyle);
   }
}
