

export default function($scope) {
  const $$phase = $scope.$root;
  if ($$phase !== '$apply' && $$phase !== '$digest') {
    $scope.$apply();
  }
}
