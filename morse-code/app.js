module = angular.module('app', ['ui.event']);

// 1 = dot, 0 = dash
module.constant('codes', {
    '10'   : 'a',
    '0111' : 'b',
    '0101' : 'c',
    '011'  : 'd',
    '1'    : 'e',
    '1101' : 'f',
    '001'  : 'g',
    '1111' : 'h',
    '11'   : 'i',
    '1000' : 'j',
    '010'  : 'k',
    '1011' : 'l',
    '00'   : 'm',
    '01'   : 'n',
    '000'  : 'o',
    '1001' : 'p',
    '0010' : 'q',
    '101'  : 'r',
    '111'  : 's',
    '0'    : 't',
    '110'  : 'u',
    '1110' : 'v',
    '100'  : 'w',
    '0110' : 'x',
    '0100' : 'y',
    '0011' : 'z',
    '00000': '0',
    '10000': '1',
    '11000': '2',
    '11100': '3',
    '11110': '4',
    '11111': '5',
    '01111': '6',
    '00111': '7',
    '00011': '8',
    '00001': '9',
});

module.controller('app', function($scope, codes, $timeout){

    // Milliseconds
    $scope.timers = {
        dot: 100, // base unit of time
        dash: 300, // length of dash (3x dot)
        letter: 300, // space between letters (3x dot)
        word: 700 // space between words (7x dot)
    };
    $scope.letter = '';
    $scope.word = '';
    $scope.sentence = '';

    var start;
    var end;
    timestamp = function(){
        return (new Date()).getTime();
    }
    $scope.tap = function(){
        start = timestamp();

        $timeout.cancel(letterTimer);
        $timeout.cancel(wordTimer);
    };

    var letterTimer;
    var wordTimer;

    $scope.untap = function(){
        end = timestamp();
        $scope.time = end - start;
        if ($scope.time < $scope.timers.dash)
            $scope.dot();
        else
            $scope.dash();


        letterTimer = $timeout(function(){
            $scope.pause();
        }, $scope.timers.letter);
        wordTimer = $timeout(function(){
            $scope.space();
        }, $scope.timers.word);
    };

    $scope.clear = function(){
        if ($scope.letter)
            $scope.letter = '';
        else if ($scope.word)
            $scope.word = '';
        else
            $scope.sentence = '';
    };

    $scope.dot = function(){
        $scope.letter += '1';
    };

    $scope.dash = function(){
        $scope.letter += '0';
    };

    $scope.pause = function(){
        if (codes[$scope.letter]) {
            $scope.word += codes[$scope.letter];
            $scope.say(codes[$scope.letter]);
        }
        $scope.letter = '';
    };

    $scope.space = function(){
        if ($scope.word) {
            $scope.sentence += ' ' + $scope.word;
            $scope.say($scope.word);
            $scope.word = '';
        } else {
            $scope.sentence += '.  ';
            $scope.say($scope.sentence);
        }
    };

    $scope.say = function(text){
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };
});
