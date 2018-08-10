(function($) {
    "use strict";
  var projectRow = $(".project-row");
  if(projectRow) {
    $(projectRow).find(".markup").each(function () {
      var projectCard = $(this);
      getRepo(projectCard);
    })
  }

  function getRepo(element) {
    var url = "https://api.github.com/repos/" + element.attr("full-name");
    $.ajax({
      url: url,
      type: "GET",
      cache: true,
      success: function(repo) {
        var footer = element.find(".markup-footer");
          if (footer) {
            var elms = $(footer).children();
            if (elms != null && elms.length == 2) {
              $(elms[0]).prepend(repo.watchers);
              $(elms[1]).prepend(repo.forks);
            }
          }
      }
    });
  }
})(jQuery);
