export function buildPayload(type, payload) {
  var template = `#! /bin/sh

set -e

PAYLOAD='${payload}'
TYPE='${type}'

LOG_INFO() {
    local content=$@
    echo -e "\\033[32m[INFO] \${content}\\033[0m"
}

LOG_ERROR() {
    local content=$@
    echo -e "\\033[31m[ERROR] \${content}\\033[0m"
}


help() {
    echo "$1"
    cat <<EOF
Deploy contract
Usage:
    bash $0 <user name>
e.g
    bash $0 bcos_user1
EOF
    exit 0
}

main() {
    LOG_INFO "Deploy with Payload: "
    echo -e \${PAYLOAD}
    LOG_INFO "Deploy with type:" \${TYPE}

    case \${TYPE} in
    BCOS2.0)
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.bcos.normal.BCOSStubFactory customCommand \${1} "\${PAYLOAD}"
        ;;
    GM_BCOS2.0)
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.bcos.guomi.BCOSGMStubFactory customCommand \${1} "\${PAYLOAD}"
        ;;
    Fabric)
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.fabric.FabrictubFactory customCommand "\${PAYLOAD}"
        ;;
    *)
        LOG_ERROR "Unsupported plugin name: "
        ;;
    esac

    LOG_INFO "Deploy SUCCESS!"
}

if [ \$# != 1 ]; then
    help
    exit 0
fi

main \$@
`
  return template
}

