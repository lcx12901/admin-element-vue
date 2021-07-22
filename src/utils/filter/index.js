import Vue from 'vue'

Vue.filter('formatDate', (value) => {
    var date = new Date(Number(value));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
})