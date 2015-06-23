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
        }.bind(this),
        function (err) { // Fail
            console.error(err)
        }
    )

    this.getJokeAuthor = function () {
        if (this.currentJokeAuthor) {
            if (this.currentJokeAuthor.nickname)
                return this.currentJokeAuthor.nickname
            return "un auteur anonyme"
        }
        else {
            var joke = this.getJoke()
            if (joke) {
                this.currentJokeAuthor = Joke.joker({
                    id: joke.id,
                    refresh: true
                })
                if (this.currentJokeAuthor.nickname) {
                    return this.currentJokeAuthor.nickname
                }
                else {
                    return "un auteur anonyme"
                }
            }
        }
    }

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
            this.currentJokeAuthor = null   // reset the current author
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

.controller('NewJokeCtrl', function ($scope, Joke, $rootScope) {

    this.sendJoke = function () {
        var data = {
            title: $scope.Common.jokeTitle,
            content: $scope.Common.jokeContent
        }
        if ($rootScope.currentUser != undefined) {
            data['jokerId'] = $rootScope.id
        }
        Joke.create(data,
            function (ans) { console.log(ans)},
            function (err) { console.error(err)})
    }
})

.controller('LoginCtrl', function ($scope, Joker, $rootScope, $state) {
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

        $state.go('main.shuffle')
    }
})