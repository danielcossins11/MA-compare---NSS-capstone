app.controller("ArtDetailsCtrl", 
  ["$scope",
   "$routeParams",
   "$firebaseArray",
   "$location",
   "$rootScope",
   "getCheckboxes",
  function($scope,  $routeParams, $firebaseArray, $location, $rootScope, getCheckboxes) {
    var ref = new Firebase("https://ma-compare.firebaseio.com/arts"); 

    $scope.edit=false;
    $scope.loggedIn = $rootScope.user;
    // $scope.videos=[];

    // Data from firebase 
    $scope.arts = $firebaseArray(ref);
    console.log($scope.arts);
    console.log($routeParams.name);

    var ref2 = new Firebase("https://ma-compare.firebaseio.com/genres"); 
    $scope.genres = $firebaseArray(ref2);
    var ref3 = new Firebase("https://ma-compare.firebaseio.com/techniques"); 
    $scope.techniques = $firebaseArray(ref3);

    var ref4 = new Firebase("https://ma-compare.firebaseio.com/users"); 
    $scope.users = $firebaseArray(ref4);
    console.log($scope.users);

    //finds the correctly clicked art
    $scope.arts.$loaded()
    .then(function() {
      console.log($scope.arts);
      for(var i=0; i<$scope.arts.length; i++){
        if($scope.arts[i].name === $routeParams.name){
          $scope.clickedArt = $scope.arts[i];
          if($scope.clickedArt.video!==undefined){
            $scope.video = $scope.clickedArt.video;
            $scope.video = $scope.video.split("=")[1];
            console.log($scope.video);
          }
        }
      }

      // $scope.genres.$loaded()
      // .then(function(){
      //   $scope.matchingGenres = [];
      //   for(var k=0; k<$scope.genres.length; k++){
      //     if($scope.genres[k].genres!==undefined){
      //       for(var l=0; l<$scope.genres[k].genres.length; l++){
      //         if($scope.genres[k].arts[l].name === $scope.clickedArt.name){
      //           $scope.matchingGenres.push({name: $scope.genres[k].name, image: $scope.genres[k].image});
      //         }  
      //       }
      //     }
      //   }
      //   console.log($scope.matchingArts);
      // });

      // $scope.techniques.$loaded()
      // .then(function(){
      //   $scope.matchingTechs = [];
      //   for(var j=0; j<$scope.techniques.length; j++){
      //     if($scope.techniques[j].genres!==undefined){
      //       for(var h=0; h<$scope.techniques[j].genres.length; h++){
      //         if($scope.techniques[j].genres[h].name === $scope.clickedGenre.name){
      //           $scope.matchingTechs.push({name: $scope.techniques[j].name, image: $scope.techniques[j].image});
      //         }  
      //       }
      //     }
      //   }
      //   console.log($scope.matchingTechs);
      // });
    })
    .catch(function(err) {
      console.error(err);
    });




    $scope.vote = function(){
      // $scope.clickedArt.votes = {};
      // $scope.users = [];
      $scope.currentUser = {};
      var result = false;
      console.log("user info", $rootScope.user);
      for(var j=0; j<$scope.users.length; j++){
        console.log($rootScope.user);
        if($rootScope.user.uid===$scope.users[j].uid){
          $scope.currentUser = $scope.users[j];
          result=true;
        }
      }
      if(result===false){
        $scope.currentUser.uid = $rootScope.user.uid;
        // $scope.users.push($scope.currentUser);
      }










      var votesArr = angular.element(".votes");
      for(var i=0; i<votesArr.length; i++){
        if(votesArr[i].checked){
/////////////removes the vote from the previously voted art
          var previouslyVotedArt = $scope.currentUser.arts[votesArr[i].value];
          for(var k=0; k<$scope.arts.length; k++){
            if($scope.arts[k].name===previouslyVotedArt){
              console.log("before", $scope.arts[k]);
              console.log(votesArr[i].value);
              $scope.arts[k].votes[votesArr[i].value]--;
              // console.log($scope.arts[k].votes[votesArr[i].value]++);
              console.log("after", $scope.arts[k]);
              // $scope.arts.$remove($scope.arts[k]);
              // $scope.arts.$add($scope.arts[k]);
              $scope.arts.$save($scope.arts[k]);
            }
          }
///////////////////////////////////////////////////////////


          console.log(votesArr[i], "checked");
          if($scope.clickedArt.votes[votesArr[i].value]===undefined){
            $scope.clickedArt.votes[votesArr[i].value] = 1;
          }else{
            $scope.clickedArt.votes[votesArr[i].value]++;
          }
          console.log($scope.clickedArt);
          $scope.currentUser.arts[votesArr[i].value] = $scope.clickedArt.name;
        }
      }
      console.log($scope.currentUser);
      console.log($scope.users);
      // $scope.users.$remove($scope.currentUser);
      // $scope.users.$add($scope.currentUser);
      $scope.users.$save($scope.currentUser);
      // $scope.arts.$remove($scope.clickedArt);
      // $scope.arts.$add($scope.clickedArt);
      $scope.arts.$save($scope.clickedArt);
    };

    $scope.changeEdit = function(){
      if($scope.edit){
        $scope.edit=false;
      }else{
        $scope.edit=true;
      }
      // angular.element("#artName").val() = $scope.clickedArt.name;
      document.getElementById("artNameEdit").value = $scope.clickedArt.name;
      document.getElementById("artLogoEdit").value = $scope.clickedArt.image;
      document.getElementById("artDescriptionEdit").value = $scope.clickedArt.description;
      document.getElementById("artVideoEdit").value = $scope.clickedArt.video;
    };

    $scope.update = function(){
      $scope.clickedArt.name = angular.element("#artNameEdit").val();
      $scope.clickedArt.image = angular.element("#artLogoEdit").val();
      $scope.clickedArt.description = angular.element("#artDescriptionEdit").val();
      $scope.clickedArt.video = angular.element("#artVideoEdit").val();
      $scope.clickedArt.genres = getCheckboxes(".checkGenres");
      $scope.clickedArt.techniques = getCheckboxes(".checkTechniques");
      // getGenreBoxes();
      // getTechBoxes();



      console.log($scope.clickedArt);
      $scope.arts.$save($scope.clickedArt);
      $scope.edit=false;
    };

    $scope.checkCheckboxes = function(){
      var allGenreChecksArr = angular.element(".checkGenres");
      console.log(allGenreChecksArr);
      console.log(allGenreChecksArr[0].value);
      for(var i=0; i<allGenreChecksArr.length; i++){
        if($scope.clickedArt.genres!==undefined){
          for(var j=0; j<$scope.clickedArt.genres.length; j++){
            console.log($scope.clickedArt.genres[j].name, allGenreChecksArr[i].value);
            if($scope.clickedArt.genres[j].name===allGenreChecksArr[i].value){
              allGenreChecksArr[i].checked = true;
              console.log(allGenreChecksArr[i]);
            }
          }
        }
      }

      var allTechChecksArr = angular.element(".checkTechniques");
      console.log(allTechChecksArr);
      console.log(allTechChecksArr[0].value);
      for(var k=0; k<allTechChecksArr.length; k++){
        if($scope.clickedArt.techniques!==undefined){
          for(var l=0; l<$scope.clickedArt.techniques.length; l++){
            console.log($scope.clickedArt.techniques[l].name, allTechChecksArr[k].value);
            if($scope.clickedArt.techniques[l].name===allTechChecksArr[k].value){
              allTechChecksArr[k].checked = true;
              console.log(allTechChecksArr[k]);
            }
          }
        }
      }
    };

    // function getGenreBoxes(){
    //   var allGenreChecksArr = angular.element(".checkGenres");
    //   $scope.clickedArt.genres = [];
    //   for(var i=0; i<allGenreChecksArr.length; i++){
    //     if(allGenreChecksArr[i].checked===true){
    //       console.log("checked");
    //       for(var j=0; j<$scope.genres.length; j++){
    //         console.log("compare", $scope.genres[j].name, allGenreChecksArr[i].value);
    //         if($scope.genres[j].name===allGenreChecksArr[i].value){
    //           console.log("gonna push");
    //           $scope.clickedArt.genres.push({name: $scope.genres[j].name, image: $scope.genres[j].image});
    //         }
    //       }
    //     }
    //   }
    // }
    // function getTechBoxes(){
    //   var allTechniqueChecksArr = angular.element(".checkTechniques");
    //   $scope.clickedArt.techniques = [];
    //   for(var i=0; i<allTechniqueChecksArr.length; i++){
    //     if(allTechniqueChecksArr[i].checked===true){
    //       console.log("checked");
    //       for(var j=0; j<$scope.techniques.length; j++){
    //         console.log("compare", $scope.techniques[j].name, allTechniqueChecksArr[i].value);
    //         if($scope.techniques[j].name===allTechniqueChecksArr[i].value){
    //           console.log("gonna push");
    //           $scope.clickedArt.techniques.push({name: $scope.techniques[j].name, image: $scope.techniques[j].image});
    //         }
    //       }
    //     }
    //   }
    // }

    // $scope.addVideos = function(){
    //   var videoArr = angular.element(".artVideo");
    //   $scope.videos[$scope.videos.length-1] = videoArr[$scope.videos.length-1];
    //   console.log($scope.videos);
    // };
  }
]);