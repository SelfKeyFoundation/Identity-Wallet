'use strict';

function CopyToClipboardDirective($document,$timeout) {
    'ngInject';
    var animationDuration = 800;

    return {
        restrict: 'A',
        scope: {
            copyToClipboard: '='
        },
        replace: false,
        link: (scope, element) => {
            angular.element(element[0]).css({"position": "relative"});

            element.bind('click',function (e) {
                let messageElement = angular.element('<textarea class="copy-to-clipboard selection">' + scope.copyToClipboard + '</textarea>');
                let fadeUp = angular.element('<div class="copy-to-clipboard-msg">Copied</div>');
                $document[0].body.append(messageElement[0]);
                element[0].append(fadeUp[0]);
                $timeout(() => {
                    messageElement[0].remove();
                    fadeUp[0].remove();
                }, animationDuration);
                messageElement[0].select();
                document.execCommand('copy');
            });
        }
    }
}

export default CopyToClipboardDirective;