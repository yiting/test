function is_A_belong_B(a, b) {
  // 视觉上A是否被B嵌套
  return (
    a.abX >= b.abX &&
    a.abY >= b.abY &&
    a.abXops <= b.abXops &&
    a.abYops <= b.abYops
  );
}
function is_A_collide_B(a, b) {
  return !(
    a.abX > b.abXops ||
    a.abY > b.abY + b.height ||
    b.abX > a.abXops ||
    b.abY > a.abYops
  );
}
module.exports = {
  is_A_belong_B,
  is_A_collide_B,
};
