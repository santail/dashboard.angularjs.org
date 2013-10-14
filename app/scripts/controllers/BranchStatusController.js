'use strict';


app.controller('BranchStatusController', [
    '$scope', 'schedule', 'jenkins', 
    'createBuildCard', 'createGoogle3Card', 'createShaCountCard',
    function BranchStatusController(
        $scope, schedule, jenkins, 
        createBuildCard, createGoogle3Card, createShaCountCard) {

  var masterBuildCard = createBuildCard();
  var stableBuildCard = createBuildCard();

  $scope.branches = [{
    title: 'master',
    cards: [masterBuildCard]
  }, {
    title: 'stable/1.0',
    cards: [stableBuildCard]
  }];

  schedule.onceAMinute(function() {
    jenkins.buildStatus('angular.js-angular-master').then(function(buildStatus) {
      masterBuildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
      $scope.$emit('dash:buildUpdate', 'master', buildStatus);
    });

    jenkins.buildStatus('angular.js-angular-v1.0.x').then(function(buildStatus) {
      stableBuildCard.update(buildStatus.happy, buildStatus.since, buildStatus.author);
      $scope.$emit('dash:buildUpdate', 'stable/1.0', buildStatus);
    });
  });
}]);
