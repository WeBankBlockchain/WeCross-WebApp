export function buildPayload(type, payload) {
  var template = `#! /bin/sh

set -e

PAYLOAD='${payload}'
TYPE='${type}'

LOG_INFO() {
    local content=\$@
    echo -e "\\033[32m[INFO] \${content}\\033[0m"
}

LOG_ERROR() {
    local content=\$@
    echo -e "\\033[31m[ERROR] \${content}\\033[0m"
}

help0() {
    echo "\$1"
    cat <<EOF
Usage:
    bash \$0
EOF
    exit 0
}

help1() {
    echo "\$1"
    cat <<EOF
Usage:
    bash \$0 <user name>
e.g
    bash \$0 bcos_user1
EOF
    exit 0
}

check_param0() {
    # param.length must be 0
    if [ \$# != 0 ]; then
        LOG_ERROR "Invalid usage"
        help0
        exit 0
    fi
}

check_param1() {
    # param.length must be 1
    if [ \$# != 1 ]; then
        LOG_ERROR "Invalid usage"
        help1
        exit 0
    fi
}

main() {
    LOG_INFO "Deploy with Payload: "
    echo -e \${PAYLOAD}
    LOG_INFO "Deploy with type:" \${TYPE}

    case \${TYPE} in
    BCOS2.0)
        check_param1 \$@
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.bcos.normal.BCOSStubFactory customCommand \${1} "\${PAYLOAD}"
        ;;
    GM_BCOS2.0)
        check_param1 \$@
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.bcos.guomi.BCOSGMStubFactory customCommand \${1} "\${PAYLOAD}"
        ;;
    Fabric1.4)
        check_param0 \$@
        java -cp conf/:lib/*:plugin/* com.webank.wecross.stub.fabric.FabricStubFactory customCommand "\${PAYLOAD}"
        ;;
    *)
        LOG_ERROR "Unsupported plugin name: "
        ;;
    esac

    LOG_INFO "Deploy SUCCESS!"
    LOG_INFO "Please update conf/chains/<chain name>/<resource config>.toml and restart the router.(If needed)"
}

main \$@
`
  return template
}

