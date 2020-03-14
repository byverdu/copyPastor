import testHelper from '../lib/helper';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.target').addEventListener('click', () => {
    alert(testHelper('Pollo'))
  })
})