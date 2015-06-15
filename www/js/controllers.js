angular.module('hdp.controllers', ['hdp.services'])

.controller('MainCtrl', function ($scope, $rootScope, User) {
    $scope.Common = $scope.Common || {Name: "xxx"}

    this.isUserLoggedIn = function () {
        return $rootScope.currentUser != undefined
    }

    this.getUserNickname = function () {
        return $rootScope.currentUser.nickname
    }

})

.controller('ShuffleJokesCtrl', function ($scope, Joke) {
    this.currentJokeID = 0

    Joke.find({
            filter : {
                where: {
                    reviewed: true
                }
            }
        },
        function (list) { // Success
            this.jokes = list
            console.log(list)
        }.bind(this),
        function (err) { // Fail
            console.error(err)
        }
    )

    this.positiveScore = function () {
        if (this.getJoke() != undefined)
            return this.getJoke().score >= 0
    }

    this.getJoke = function () {
        if (this.jokes != undefined)
            return this.jokes[this.currentJokeID]
    }

    this.downVote = function () {
        var joke = this.jokes[this.currentJokeID]
        joke.score -= 1
        joke.$save()
        this.nextJoke()
    }

    this.upVote = function () {
        var joke = this.jokes[this.currentJokeID]
        joke.score += 1
        joke.$save()
        this.nextJoke()
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

.controller('NewJokeCtrl', function ($scope, Joke) {

    this.sendJoke = function () {
        Joke.create({
            title: $scope.Common.jokeTitle,
            content: $scope.Common.jokeContent
        }, function (ans) {
            console.log(ans)
        }, function (err) {
            console.error(err)
        })
    }
})

.controller('LoginCtrl', function ($scope, Joker, $rootScope) {
    this.login = function () {
        Joker.login({
            email: $scope.Common.email,
            password: $scope.Common.password
        }, function (ans) {
            $rootScope.currentUser = {
                id: ans.userId,
                token: ans.id,
                email: ans.user.email,
                nickname: ans.user.nickname
            }
        })
    }
})