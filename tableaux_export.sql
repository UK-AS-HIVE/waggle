SELECT
 node.nid AS nid,
 node.uid AS author_uid,
 users.name AS author_name,

 field_revision_field_department.field_department_value AS author_department,

 node_comment_statistics.comment_count AS node_comment_statistics_comment_count,
 FROM_UNIXTIME(node.created) AS node_created,
 FROM_UNIXTIME(node_revision.timestamp) AS node_close_time,
 FROM_UNIXTIME(comment.created) AS node_comment_first_comment_timestamp,
 FROM_UNIXTIME(node_comment_statistics.last_comment_timestamp) AS node_comment_statistics_last_comment_timestamp,
 field_data_field_associated_users.delta AS field_data_field_associated_users_delta,
 
 field_data_field_role_visibility.delta AS field_data_field_role_visibility_delta,
 field_data_field_tags.field_tags_tid AS field_data_field_tags_field_tags_tid,
 tag_names.name AS tags,
 field_data_field_attachments.field_attachments_fid,

 field_data_body.body_value,
 field_data_field_contact.field_contact_value AS contact,
 field_data_field_due_date.field_due_date_value AS due_date,
 field_data_field_hostname.field_hostname_value AS hostname,
 field_data_field_ip_address.field_ip_address_value AS ip_address,
 field_data_field_location.field_location_value AS location,

 field_data_field_associated_users.field_associated_users_uid AS associated_users_uid,

 field_data_field_role_visibility.field_role_visibility_value AS role_visibility_rid,
 role.name AS role_visibility,

 field_data_field_status.field_status_tid AS status_tid,
 status_term_names.name AS status,

 FROM_UNIXTIME(node.created) AS created,
 FROM_UNIXTIME(GREATEST(node.changed, node_comment_statistics.last_comment_timestamp)) AS last_updated

FROM node

INNER JOIN node_comment_statistics ON node.nid = node_comment_statistics.nid
LEFT JOIN  field_data_field_associated_users ON node.nid = field_data_field_associated_users.entity_id
LEFT JOIN  field_data_field_role_visibility ON node.nid = field_data_field_role_visibility.entity_id
LEFT JOIN role ON field_data_field_role_visibility.field_role_visibility_value = role.rid
LEFT JOIN field_data_field_tags ON node.nid = field_data_field_tags.entity_id
LEFT JOIN taxonomy_term_data as tag_names ON field_data_field_tags.field_tags_tid = tag_names.tid
LEFT JOIN field_data_field_attachments ON node.nid = field_data_field_attachments.entity_id

LEFT JOIN field_data_body ON node.nid = field_data_body.entity_id
LEFT JOIN field_data_field_closed_time ON node.nid = field_data_field_closed_time.entity_id
LEFT JOIN field_data_field_contact ON node.nid = field_data_field_contact.entity_id

LEFT JOIN field_data_field_due_date ON node.nid = field_data_field_due_date.entity_id
LEFT JOIN field_data_field_hostname ON node.nid = field_data_field_hostname.entity_id
LEFT JOIN field_data_field_ip_address ON node.nid = field_data_field_ip_address.entity_id

LEFT JOIN field_data_field_location ON node.nid = field_data_field_location.entity_id



LEFT JOIN field_data_field_status ON node.nid = field_data_field_status.entity_id
LEFT JOIN taxonomy_term_data status_term_names ON field_data_field_status.field_status_tid = status_term_names.tid

LEFT JOIN field_revision_field_department ON node.uid = field_revision_field_department.entity_id AND field_revision_field_department.revision_id = (SELECT MAX(vid) FROM user_revision WHERE uid=field_revision_field_department.entity_id AND timestamp<node_comment_statistics.last_comment_timestamp)

LEFT JOIN node_revision ON node_revision.nid = node.nid AND node_revision.vid = (SELECT revision_id FROM field_data_field_status WHERE field_data_field_status.entity_id = node.nid AND field_data_field_status.field_status_tid = 2)

LEFT JOIN comment ON comment.nid = node.nid AND comment.created = (SELECT MIN(created) FROM comment WHERE comment.nid = node.nid)

LEFT JOIN users ON node.uid = users.uid
ORDER BY node_created ASC

