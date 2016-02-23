'use strict';

angular.module($snaphy.getModuleName())

//Controller for aboutUsControl ..
.controller('aboutUsControl', ['$scope', '$stateParams', 'Database', '$state', '$timeout', 'SnaphyTemplate',
    function($scope, $stateParams, Database, $state, $timeout, SnaphyTemplate) {

        //------------------------------------GLOBAL VARIABLES-----------------------------------------
        //Checking if default templating feature is enabled..
        var defaultTemplate = $snaphy.loadSettings('aboutUs', "defaultTemplate");
        $scope.companyInfoList = $snaphy.loadSettings('aboutUs', "companyInfo");
        $scope.companyName = $snaphy.loadSettings('aboutUs', "companyName");
        $scope.loaded = false;
        $scope.stateName = $state.current.name;
        var database = Database.getDb("aboutUs", "CompanyInfo");
        //---------------------------------------------------------------------------------------

        $snaphy.setDefaultTemplate(defaultTemplate);
        //Use Database.getDb(pluginName, PluginDatabaseName) to get the Database Resource.
        //$scope.data = {};
        //Save Data function..
        $scope.saveData = function(stateName, data){
            $scope.data.html = $scope.getHtmlData();
            if($scope.data.html && $scope.loaded){
                if($scope.data.id === undefined ){
                    $scope.data.type = $scope.stateName;
                    database.create({}, $scope.data, function(value, respHeader){
                        SnaphyTemplate.notify({
                            message: "Data successfully created.",
                            type: 'success',
                            icon: 'fa fa-check',
                            align: 'right'
                        });
                        $timeout(function(){
                            $scope.data = value;

                        });
                    }, function(httpResp){
                        SnaphyTemplate.notify({
                            message: "Error updating data. Please try sometime later.",
                            type: 'danger',
                            icon: 'fa fa-times',
                            align: 'right'
                        });
                        console.error(httpResp);
                    });
                }else{
                    database.update({where: {id: $scope.data.id}}, $scope.data, function(value, respHeader){
                        console.log("Successfully updated value..");
                        /*Delete the data from the database..*/
                        SnaphyTemplate.notify({
                            message: "Data successfully updated.",
                            type: 'success',
                            icon: 'fa fa-check',
                            align: 'right'
                        });
                    }, function(httpResp){
                        console.error(httpResp);
                        SnaphyTemplate.notify({
                            message: "Error updating data. Please try sometime later.",
                            type: 'danger',
                            icon: 'fa fa-times',
                            align: 'right'
                        });
                    });
                }
            }
        };


        $scope.init = function(){
            database.find({
                filter:{
                    where:{
                        type: $scope.stateName
                    }
                }
            }, function(value, respHeader){
                $scope.loaded = true;
                if(value.length){
                    $scope.data = value[0];

                }
            }, function(httpResp){
                console.error(httpResp);
            });
        };


    }//controller function..
]);
