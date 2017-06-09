(function($) {
    "use strict"; // Start of use strict
    $.ajax({
        url: "https://api.github.com/orgs/tmobile/repos",
        type: "GET",
        cache: true,
        success: function(repos) {
            $("input[name='projectName']").each(function(){
                var name = $(this).val();
                var repo = $.grep(repos, function(r){
                    return r.name == name;
                })
                if(repo && repo.length == 1){
                    var desc = $("#" + name + "_description");
                    var forks = $("#" + name + "_forks");
                    var stars = $("#" + name + "_stars")

                    if(desc){
                        //set description
                        desc.text(repo[0].description);
                    }
                    if(forks){
                        //set forks
                        forks.text(forks.text() + repo[0].forks)
                    }
                    if(stars){
                        //set stars
                        stars.text(stars.text() + repo[0].watchers)
                    }
                }
            })
        }
    })

})(jQuery); // End of use strict
