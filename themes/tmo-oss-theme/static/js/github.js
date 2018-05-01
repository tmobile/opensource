(function($) {
    "use strict"; // Start of use strict
    $.ajax({
        url: "https://api.github.com/orgs/tmobile/repos",
        type: "GET",
        cache: true,
        success: function(repos) {
            var projectRow = $(".project-row");
            if(projectRow) {
                $(projectRow).find(".markup").each(function(){
                    var name = $(this).find(".markup-text").text();
                    var repo = $.grep(repos, function(r){
                        return r.name == name;
                    })
                    if(repo && repo.length == 1){
                        var footer = $(this).find(".markup-footer");
                        if(footer) {
                            var elms = $(footer).children();
                            if(elms != null && elms.length == 2){
                                $(elms[0]).prepend(repo[0].watchers);
                                $(elms[1]).prepend(repo[0].forks);
                            }
                        }
                    }
                })
            }
        }
    });

    $.ajax({
        url: "https://api.github.com/repos/hyperledger/sawtooth-next-directory",
        type: "GET",
        cache: true,
        success: function(repo) {
            var nextIdentity = $('.project-row .markup[repo="next-identity"]');
            if(repo) {
                    var footer = nextIdentity.find(".markup-footer");
                    if(footer) {
                        var elms = $(footer).children();
                        if(elms != null && elms.length == 2){
                            $(elms[0]).prepend(repo.watchers);
                            $(elms[1]).prepend(repo.forks);
                        }
                    }
            }
        }
    });

})(jQuery); // End of use strict
