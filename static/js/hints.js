$(function() {
    $('.show-hint').click(function(node) {
        console.log('hey');
        console.log(node);
        console.log($(node.target).next());
        $(node.target).next().show();
    });
});
