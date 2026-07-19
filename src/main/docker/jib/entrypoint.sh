#!/bin/bash

echo "START=>###################################################################"
echo "=>The application will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}


# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
    local var="$1"
    local file_var="${var}_FILE"
    local def="${2:-}"
    if [[ ${!var:-} && ${!file_var:-} ]]; then
        echo >&2 "error: both $var and $file_var are set (but are exclusive)"
        exit 1
    fi
    local val="$def"
    if [[ ${!var:-} ]]; then
        val="${!var}"
    elif [[ ${!file_var:-} ]]; then
        val="$(< "${!file_var}")"
    fi

    if [[ -n $val ]]; then
        export "$var"="$val"
    fi

    unset "$file_var"
    return 0
}

file_env 'SPRING_PROFILES_ACTIVE'
file_env 'SPRING_DATASOURCE_URL'
file_env 'SPRING_DATASOURCE_USERNAME'
file_env 'SPRING_DATASOURCE_PASSWORD'
file_env 'SPRING_LIQUIBASE_URL'
file_env 'SPRING_LIQUIBASE_USER'
file_env 'SPRING_LIQUIBASE_PASSWORD'
file_env 'JHIPSTER_REGISTRY_PASSWORD'
file_env 'BASE64_SECRET'

echo "SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE"
echo "SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL"
echo "SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME"
echo "BASE64_SECRET=$BASE64_SECRET"
echo "SPRING_LIQUIBASE_URL=$SPRING_LIQUIBASE_URL"
echo "SPRING_LIQUIBASE_USER=$SPRING_LIQUIBASE_USER"
echo "###################################################################=>END"
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -cp /app/resources/:/app/classes/:/app/libs/* "com.sis.SchInfoSysApp"  "$@"
