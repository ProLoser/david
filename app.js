module = angular.module('app', []);

module.controller('app', function($scope){
    
    var canvasElement = document.getElementById("displayArea");
    var displayArea = canvasElement.getContext("2d");

    var controller = new Leap.Controller();
    controller.on("frame", function(frame){
        if (!frame.pointables.length) return;
        

        //Get a pointable and normalize the tip position
        var pointable = frame.pointables[0];
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

        
        $scope.pointable = pointable;
        $scope.interactionBox = interactionBox;
        $scope.normalizedPosition = normalizedPosition;
        
        $scope.$apply();
    });
    controller.connect();
    
    $scope.letters = [
        ['Q', 'A', 'Z'],
        ['W', 'S', 'X'],
        ['E', 'D', 'C'],
        ['R', 'F', 'V'],
        ['T', 'G', 'B'],
        ['Y', 'H', 'N'],
        ['U', 'J', 'M'],
        ['I', 'K'],
        ['O', 'L'],
        ['P']
    ];
    // X Axis
    // right edge
    $scope.$watch('normalizedPosition[0] === 1', _.throttle(function(newVal){
        if (!newVal) return;

        $scope.addWord($scope.word);
        $scope.word = '';
    }, 500));

    // left edge
    $scope.$watch('normalizedPosition[0] === 0', _.throttle(function(newVal){
        if (!newVal) return;

        if ($scope.word) $scope.word = ''
        else $scope.removeWord();
    }, 500));

    $scope.word = 'test';
    $scope.sentence = 'This is a practice';

    // Y Axis
    $scope.triggerHeight = .1;
    // up
    $scope.$watch('normalizedPosition[1] < triggerHeight', _.throttle(function(newVal){
        if (!newVal) return;

        column = $scope.getColumn();
        $scope.addLetter($scope.letters[column][0]);
    }, 1000));

    // down
    // $scope.$watch('normalizedPosition[1] > triggerHeight', _.throttle(function(newVal){
    //     if (!newVal) return;
    // }, 1000));

    // Z Axis
    $scope.getColumn = function() {
        return Math.floor($scope.normalizedPosition[0] * 10);
    };
    // $scope.$watch('normalizedPosition[2]', _.throttle(function(newVal){
        
    // }, 500));

    $scope.removeWord = function(word) {
        sentence = $scope.sentence.split(' ');
        $scope.say('Removed ' + sentence.pop());
        $scope.sentence = sentence.join(' ');
    };
    $scope.addLetter = function(letter) {
        $scope.word += letter;  
        $scope.say(letter);
    };
    $scope.addWord = function(word) {
        if (word){
            $scope.say(word);
            $scope.sentence += ' ' + word;
        } else {
            $scope.say($scope.sentence);
        }
    };
    $scope.say = function(text){
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };
});
