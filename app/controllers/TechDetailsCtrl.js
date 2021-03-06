app.controller("TechDetailsCtrl", 
  ["$scope",
   "$routeParams",
   "$firebaseArray",
   "$location",
   "$rootScope",
   "getCheckboxes",
  function($scope,  $routeParams, $firebaseArray, $location, $rootScope, getCheckboxes) {
    //CSS
    angular.element(".active").removeClass("active");
    /////
    var ref = new Firebase("https://ma-compare.firebaseio.com/techniques"); 

    $scope.edit=false;
    $scope.loggedIn = $rootScope.user;
    $scope.voteShow=false;
    $scope.clickedOnce = false;

    // Data from firebase 
    $scope.techs = $firebaseArray(ref);
    console.log($scope.techs);
    console.log($routeParams.name);

    var ref2 = new Firebase("https://ma-compare.firebaseio.com/genres"); 
    $scope.genres = $firebaseArray(ref2);

    var ref3 = new Firebase("https://ma-compare.firebaseio.com/arts"); 
    $scope.arts = $firebaseArray(ref3);

    var ref4 = new Firebase("https://ma-compare.firebaseio.com/users"); 
    $scope.users = $firebaseArray(ref4);
    console.log($scope.users);

    $scope.changeVote = function(){
      if($scope.voteShow){
        $scope.voteShow=false;
      }else{
        $scope.voteShow=true;
      }
      $scope.edit=false;

      //This checks the checkboxes
      var voteChecksArr = angular.element(".votes");
      console.log(voteChecksArr);
      console.log($scope.users);
      for(var i=0; i<$scope.users.length; i++){
        if($rootScope.user.uid===$scope.users[i].uid){
          console.log($scope.users[i]);
          console.log($scope.users[i].techniques);
          for(var k=0; k<voteChecksArr.length; k++){
            console.log($scope.users[i].techniques, voteChecksArr[k].value, $scope.clickedTech.name);
            if($scope.users[i].techniques[voteChecksArr[k].value]===$scope.clickedTech.name){
              voteChecksArr[k].checked=true;
            }
          }
        }
      }
    };
    $scope.genreCheck=false;
    $scope.changeGenreCheck = function(){
      if($scope.genreCheck){
        $scope.genreCheck=false;
      }else{
        $scope.genreCheck=true;
      }
    };
    $scope.artCheck=false;
    $scope.changeArtsCheck = function(){
      if($scope.artCheck){
        $scope.artCheck=false;
      }else{
        $scope.artCheck=true;
      }
    };



    $scope.techs.$loaded()
    .then(function() {
      console.log($scope.techs);
      for(var i=0; i<$scope.techs.length; i++){
        if($scope.techs[i].name === $routeParams.name){
          $scope.clickedTech = $scope.techs[i];
          if($scope.clickedTech.videos!==undefined){
            for(var q=0; q<$scope.clickedTech.videos.length; q++){
              console.log($scope.clickedTech.videos[q].indexOf('='));
              if($scope.clickedTech.videos[q].indexOf('=') !== -1){
                $scope.clickedTech.videos[q] = $scope.clickedTech.videos[q].split("=")[1];
              }
              angular.element("#video").append("<br><iframe width='80%' height='315' src='http://www.youtube.com/embed/"+$scope.clickedTech.videos[q]+"' allowfullscreen></iframe>");
            }
          }
          if($scope.clickedTech.comments!==undefined){
            for(var w=0; w<$scope.clickedTech.comments.length; w++){
              for(var p=0; p<$scope.users.length; p++){
                if($scope.users[p].uid===$scope.clickedTech.comments[w].uid){
                  if($scope.users[p].username!==""){
                    $scope.clickedTech.comments[w].name=$scope.users[p].username;
                  }else{
                    $scope.clickedTech.comments[w].name=$scope.users[p].email;
                  }
                  if($scope.users[p].userImage!==""){
                    $scope.clickedTech.comments[w].image = $scope.users[p].userImage;
                  }else{
                    $scope.clickedTech.comments[w].image = $scope.users[p].image;
                  }
                }
              }
            }
          }
        }
      }

      $scope.genres.$loaded()
      .then(function(){
        $scope.matchingGenres = [];
        for(var k=0; k<$scope.genres.length; k++){
          if($scope.clickedTech.genres!==undefined){
            for(var l=0; l<$scope.clickedTech.genres.length; l++){
              if($scope.genres[k].name === $scope.clickedTech.genres[l]){
                $scope.matchingGenres.push({name: $scope.genres[k].name, image: $scope.genres[k].image});
              }
            }
          }
        }
        console.log("matching genres", $scope.matchingGenres);
      });

      $scope.arts.$loaded()
      .then(function(){
        $scope.matchingArts = [];
        for(var j=0; j<$scope.arts.length; j++){
          if($scope.clickedTech.arts!==undefined){
            for(var h=0; h<$scope.clickedTech.arts.length; h++){
              if($scope.arts[j].name === $scope.clickedTech.arts[h]){
                $scope.matchingArts.push({name: $scope.arts[j].name, image: $scope.arts[j].image});
              }
            }
          }
        }
        console.log("matching arts", $scope.matchingArts);
      });
    })
    .catch(function(err) {
      console.error(err);
    });


    $scope.vote = function(){
      // $scope.clickedTech.votes = {};
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








      if($scope.clickedTech.votes===undefined){
        $scope.clickedTech.votes = {};
      }
      var votesArr = angular.element(".votes");
      for(var i=0; i<votesArr.length; i++){
        if(votesArr[i].checked){
          /////////////removes the vote from the previously voted art
          var previouslyVotedTech = $scope.currentUser.techniques[votesArr[i].value];
          console.log(previouslyVotedTech);
          for(var k=0; k<$scope.techs.length; k++){
            if($scope.techs[k].name===previouslyVotedTech){
              console.log("before", $scope.techs[k]);
              console.log(votesArr[i].value);
              if($scope.techs[k].votes[votesArr[i].value]>0){
                console.log($scope.techs[k].votes[votesArr[i].value]);
                $scope.techs[k].votes[votesArr[i].value]--;
              }
              // console.log($scope.techs[k].votes[votesArr[i].value]++);
              console.log("after", $scope.techs[k]);
              // $scope.techs.$remove($scope.techs[k]);
              // $scope.techs.$add($scope.techs[k]);
              $scope.techs.$save($scope.techs[k]);
            }
          }
///////////////////////////////////////////////////////////
          console.log(votesArr[i], "checked");
          console.log($scope.clickedTech.votes[votesArr[i].value]);
          if($scope.clickedTech.votes[votesArr[i].value]===undefined){
            $scope.clickedTech.votes[votesArr[i].value] = 1;
          console.log($scope.clickedTech.votes[votesArr[i].value]);
          }else{
            $scope.clickedTech.votes[votesArr[i].value]++;
          }
          console.log($scope.clickedTech);
          $scope.currentUser.techniques[votesArr[i].value] = $scope.clickedTech.name;
        }else{
          if($scope.currentUser.techniques[votesArr[i].value]===$scope.clickedTech.name){
            $scope.currentUser.techniques[votesArr[i].value] = "no vote";
            $scope.clickedTech.votes[votesArr[i].value]--;
          }
        }
      }
      console.log($scope.clickedTech);
      $scope.users.$save($scope.currentUser);
      // $scope.techs.$remove($scope.clickedTech);
      // $scope.techs.$add($scope.clickedTech);
      $scope.techs.$save($scope.clickedTech);
    };

    $scope.changeEdit = function(){
      if($scope.edit){
        $scope.edit=false;
      }else{
        $scope.edit=true;
      }
      $scope.voteShow = false;
      document.getElementById("techNameEdit").innerHTML = $scope.clickedTech.name;
      document.getElementById("techLogoEdit").value = $scope.clickedTech.image;
      document.getElementById("techDescriptionEdit").value = $scope.clickedTech.description;
      // document.getElementById("techVideoEdit").value = $scope.clickedTech.videos;
    };





    $scope.update = function(){
      // $scope.clickedTech.name = angular.element("#techNameEdit").val();
      $scope.clickedTech.image = angular.element("#techLogoEdit").val();
      $scope.clickedTech.description = angular.element("#techDescriptionEdit").val();
      if($scope.clickedOnce){
        $scope.clickedTech.arts = getCheckboxes(".checkArts");
        $scope.clickedTech.genres = getCheckboxes(".checkGenres");
      }
      if($scope.clickedTech.videos!==undefined){
        if(angular.element("#techVideoEdit").val()){
          $scope.clickedTech.videos.push(angular.element("#techVideoEdit").val());
        }
      }else{
        if(angular.element("#techVideoEdit").val()){
          $scope.clickedTech.videos = [];
          $scope.clickedTech.videos.push(angular.element("#techVideoEdit").val());
        }
      }



      console.log($scope.clickedTech);
      $scope.techs.$save($scope.clickedTech);
      $scope.edit=false;
      location.reload();
    };


    $scope.checkCheckboxes = function(){
      $scope.clickedOnce = true;
      var allGenreChecksArr = angular.element(".checkGenres");
      console.log(allGenreChecksArr);
      console.log(allGenreChecksArr[0].value);
      for(var i=0; i<allGenreChecksArr.length; i++){
        if($scope.clickedTech.genres!==undefined){
          for(var j=0; j<$scope.clickedTech.genres.length; j++){
            console.log($scope.clickedTech.genres[j], allGenreChecksArr[i].value);
            if($scope.clickedTech.genres[j]===allGenreChecksArr[i].value){
              allGenreChecksArr[i].checked = true;
              console.log(allGenreChecksArr[i]);
            }
          }
        }
      }

      var allArtChecksArr = angular.element(".checkArts");
      console.log(allArtChecksArr);
      console.log(allArtChecksArr[0].value);
      for(var k=0; k<allArtChecksArr.length; k++){
        if($scope.clickedTech.arts!==undefined){
          for(var l=0; l<$scope.clickedTech.arts.length; l++){
            console.log($scope.clickedTech.arts[l], allArtChecksArr[k].value);
            if($scope.clickedTech.arts[l]===allArtChecksArr[k].value){
              allArtChecksArr[k].checked = true;
              console.log(allArtChecksArr[k]);
            }
          }
        }
      }
    };

    $scope.addComment = function(){
      console.log($scope.$parent.currentUser);
      var comment = {
        body: angular.element("#addComment").val(),
        uid: $rootScope.user.uid,
        date: Date()
      };
      document.getElementById("addComment").value = "";
      $scope.clickedTech.comments.push(comment);
      $scope.techs.$save($scope.clickedTech);
    };


    // function getArtBoxes(){
    //   var allTechniqueChecksArr = angular.element(".checkArts");
    //   console.log(allTechniqueChecksArr);
    //   $scope.clickedTech.arts = [];
    //   for(var i=0; i<allTechniqueChecksArr.length; i++){
    //     if(allTechniqueChecksArr[i].checked===true){
    //       console.log("checked");
    //       for(var j=0; j<$scope.arts.length; j++){
    //         console.log("compare", $scope.arts[j].name, allTechniqueChecksArr[i].value);
    //         if($scope.arts[j].name===allTechniqueChecksArr[i].value){
    //           console.log("gonna push");
    //           $scope.clickedTech.arts.push({name: $scope.arts[j].name, image: $scope.arts[j].image});
    //           console.log($scope.clickedTech);
    //         }
    //       }
    //     }
    //   }
    // }
    // function getGenreBoxes(){
    //   var allGenreChecksArr = angular.element(".checkGenres");
    //   $scope.clickedTech.genres = [];
    //   for(var i=0; i<allGenreChecksArr.length; i++){
    //     if(allGenreChecksArr[i].checked===true){
    //       console.log("checked");
    //       for(var j=0; j<$scope.genres.length; j++){
    //         console.log("compare", $scope.genres[j].name, allGenreChecksArr[i].value);
    //         if($scope.genres[j].name===allGenreChecksArr[i].value){
    //           console.log("gonna push");
    //           $scope.clickedTech.genres.push({name: $scope.genres[j].name, image: $scope.genres[j].image});
    //         }
    //       }
    //     }
    //   }
    // }
  }
]);