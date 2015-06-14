angular.module('hdp.controllers', ['hdp.services'])

.controller('MainCtrl', function ($scope, User) {
    this.login = function () {
        User.login($scope.email, $scope.password)
    }
})

.controller('ShuffleJokesCtrl', function (Joke) {
    this.currentJokeID = 0

    Joke.find({},
        function (list) { // Success
            this.jokes = list
        }.bind(this),
        function (err) { // Fail
            console.error(err)
        }
    )

    this.getJoke = function () {
        if (this.jokes != undefined)
            return this.jokes[this.currentJokeID]
    }

    this.nextJoke = function () {
        if (this.jokes != undefined) {
            if (this.currentJokeID + 1 == this.jokes.length) {
                // We have reached the end of the list. Start over again.
                this.currentJokeID = 0
            }
            else {
                this.currentJokeID += 1
            }
        }
    }
})