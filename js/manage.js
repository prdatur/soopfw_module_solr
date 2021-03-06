/**
 * The created dialog id.
 *
 * @var int
 */
var add_server_uuid = 0;

Soopfw.behaviors.solr_admin_manage = function() {

	// Open add dialog.
	$("#add_server").off('click').on('click', function() {
		add_server_uuid = Soopfw.default_action_dialog(Soopfw.t("Add server"), 'solr', 'save_server');
	});

	// Open edit dialog.
	$(".edit_server").off('click').on('click', function() {
		add_server_uuid = Soopfw.default_action_dialog(Soopfw.t("Save server"), 'solr', 'save_server', [$(this).attr('did')]);
	});

	// Bind cancel event for add/edit dialogs.
	$("#form_id_form_add_server_btn_cancel").off('click').on('click', function() {
		save_server_success();
	});

	// Handle multi actions.
	$("#multi_action").prop("value", "");
	$("#multi_action").off('change').on('change', function() {
		var value = $(this).prop("value");

		// If empty value selected, return.
		if(value == "") {
			return false;
		}

		// Delete entries.
		if(value == "delete") {

			// Display confirm dialog.
			confirm(Soopfw.t("Really want to delete the selected servers?"), Soopfw.t("delete?"), function() {

				// Iterate through all entries.
				$(".dmySelect").each(function(a, obj) {

					// Check if we checked the checkbox.
					if($(obj).prop("checked") == true) {

						// Delete the server.
						ajax_request("/solr/delete_server.ajax",{id: $(obj).prop("value")},function() {
							$("#server_row_"+$(obj).prop("value")).remove();
						});
					}
				});

				// Reset multi action.
				$(".dmySelect").prop("checked", false);
				$("#dmySelectAll").prop("checked", false);
			});
		}
		// Commit changes.
		if(value == "commit") {

			// Display confirm dialog.
			confirm(Soopfw.t("Really want to commit all pending changes to the selected servers?"), Soopfw.t("Commit"), function() {

				// Iterate through all entries.
				$(".dmySelect").each(function(a, obj) {

					// Check if we checked the checkbox.
					if($(obj).prop("checked") == true) {

						// Delete the server.
						ajax_request("/solr/commit_server.ajax",{id: $(obj).prop("value")});
					}
				});

				// Reset multi action.
				$(".dmySelect").prop("checked", false);
				$("#dmySelectAll").prop("checked", false);
			});
		}

		// Reset multi action.
		$("#multi_action").prop("value", "");

	});

	// Handle "select all" checkbox.
	$("#dmySelectAll").off('click').on('click', function() {
		$(".dmySelect").prop("checked", $("#dmySelectAll").prop("checked"));
	});

	// Delete a single entry.
	$(".dmyDelete").off('click').on('click', function() {
		var values = $(this).attr('did');
		confirm(Soopfw.t("Really want to delete this server?"), Soopfw.t("delete?"), function() {
			ajax_success("/solr/delete_server.ajax",{id: values},Soopfw.t("Server deleted"), Soopfw.t("delete?"),function() {
				$("#server_row_"+values).remove();
			});
		});
	});

	// Commit a single entry.
	$(".dmyCommit").off('click').on('click', function() {
		var values = $(this).attr('did');
		confirm(Soopfw.t("Really want to commit all pending changes to this server?"), Soopfw.t("Commit"), function() {
			ajax_success("/solr/commit_server.ajax",{id: values},Soopfw.t("Server changes committed"), Soopfw.t("Commit"));
		});
	});
};

/**
 * If the server save succeed, it will call this method.
 */
function save_server_success() {
	// Close the server dialog.
	$("#"+add_server_uuid).dialog("destroy");
	$("#"+add_server_uuid).remove();

	// Display wait dialog while reloading.
	wait_dialog();
	location.reload();
}