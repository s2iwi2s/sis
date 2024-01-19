alter sequence org_id_seq start with 3;
alter sequence jhi_user_id_seq start with 5;
alter sequence app_config_id_seq start with 6;
alter table org
    alter column id
        set minvalue 3;
