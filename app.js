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
    $scope.$watch('normalizedPosition[0]', _.throttle(function(newVal){
        if (newVal === 1) {
            $scope.addWord($scope.word);
            $scope.word = '';
        }
        if (newVal === 0) {
            if ($scope.word) $scope.word = ''
            else $scope.removeWord();
        }
    }, 500));
    $scope.word = 'test';
    $scope.sentence = 'This is a practice';
    // Y Axis
    $scope.triggerHeight = .1;
    $scope.$watch('normalizedPosition[1]', _.throttle(function(newVal){
        var column;
        if (newVal < $scope.triggerHeight && $scope.normalizedPosition[0]) {
            column = Math.round($scope.normalizedPosition[0] * 10)
            $scope.addLetter($scope.letters[column][0]);
            $scope.active = true;
        } else {
            $scope.active = false;
        }
    }, 1000));
    // Z Axis
    $scope.isHovered = function(index) {
        return index == Math.round($scope.normalizedPosition[0] * 10);
    };
    $scope.$watch('normalizedPosition[2]', _.throttle(function(newVal){
        
    }, 500));
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
