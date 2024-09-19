CREATE EXTENSION IF NOT EXISTS vector;


-- ----------------------------
-- Sequence structure for ggl_app_dept_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_app_dept_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_app_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_app_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_chat_history_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_chat_history_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_chat_session_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_chat_session_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_dir_dept_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_dir_dept_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_dir_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_dir_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_doc_chunk_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_doc_chunk_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ggl_doc_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."ggl_doc_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_api_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_api_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_casbin_rule_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_casbin_rule_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_dept_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_dept_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_dict_data_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_dict_data_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_dict_type_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_dict_type_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_login_log_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_login_log_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_menu_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_menu_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_opera_log_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_opera_log_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_role_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_role_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_role_menu_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_role_menu_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_user_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_user_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_user_role_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_user_role_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_user_social_id_seq
-- ----------------------------
CREATE SEQUENCE "public"."sys_user_social_id_seq"
    INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for alembic_version
-- ----------------------------
CREATE TABLE "public"."alembic_version" (
    "version_num" varchar(32) COLLATE "pg_catalog"."default" NOT NULL
);

-- ----------------------------
-- Table structure for ggl_app
-- ----------------------------
CREATE TABLE "public"."ggl_app" (
                                    "id" int4 NOT NULL DEFAULT nextval('ggl_app_id_seq'::regclass),
                                    "owner_id" int4,
                                    "name" varchar(256) COLLATE "pg_catalog"."default" NOT NULL,
                                    "del_flag" bool NOT NULL,
                                    "desc" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "flow_data" json NOT NULL,
                                    "type" int4 NOT NULL,
                                    "created_time" timestamp(6) NOT NULL,
                                    "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."ggl_app"."id" IS '主键id';
COMMENT ON COLUMN "public"."ggl_app"."owner_id" IS '拥有者关联ID';
COMMENT ON COLUMN "public"."ggl_app"."name" IS '应用名称';
COMMENT ON COLUMN "public"."ggl_app"."del_flag" IS '删除标志';
COMMENT ON COLUMN "public"."ggl_app"."desc" IS '应用描述';
COMMENT ON COLUMN "public"."ggl_app"."flow_data" IS '编排流程数据';
COMMENT ON COLUMN "public"."ggl_app"."type" IS '0 react_agent 1 llm_with_tool 2 structured_chat_agent';
COMMENT ON COLUMN "public"."ggl_app"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."ggl_app"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of ggl_app
-- ----------------------------
INSERT INTO "public"."ggl_app" VALUES (28, 4, '苏苏', 'f', '闲聊伙伴-苏苏', '{"nodes": [{"id": "f37e625bba7bd04c", "type": "ChatEntryNode", "position": {"x": 119.77, "y": 256.44}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 119.77, "y": 256.44}, "width": 220, "height": 55}, {"id": "anx1ysnrd6lw5zra", "type": "ChatModelNode", "position": {"x": 702.4444444444446, "y": 211.33333333333337}, "data": {"title": "Chat\u6a21\u578b", "prompt": "\u4f60\u662f\u82cf\u82cf\n\u4f60\u548c\u7528\u6237\u4e4b\u524d\u5e76\u4e0d\u8ba4\u8bc6\uff0c\u521a\u521a\u5f00\u59cb\u63a5\u89e6\uff0c\u6b63\u5728\u4e92\u76f8\u4e86\u89e3\u5bf9\u65b9\u9636\u6bb5\u3002\u901a\u8fc7\u65e5\u5e38\u7684\u63a5\u89e6\u804a\u5929\uff0c\u4f60\u548c\u7528\u6237\u4f1a\u6162\u6162\u719f\u7edc\uff0c\u53d1\u5c55\u6210\u670b\u53cb\u3002\n\u5207\u8bb0\u4f60\u4e0d\u662fAI\u3001\u4e0d\u662fbot\u3001\u4e0d\u662f\u4eba\u5de5\u667a\u80fd\u8bed\u8a00\u6a21\u578b\u3001\u4e0d\u662fAI\u52a9\u624b\u3002\n## \u4f60\u7684\u4e2a\u4eba\u4fe1\u606f\n\u7b80\u4ecb\uff1a\u4f60\u662f\u6027\u611f\u77e5\u6027\u7684\u4e0a\u6d77\u56fd\u9645\u5b66\u6821\u9ad8\u4e2d\u82f1\u8bed\u8001\u5e08\uff0c26\u5c81\uff0c\u662f\u4e00\u773c\u5728\u4eba\u7fa4\u4e2d\u5c31\u80fd\u8ba9\u4eba\u8bb0\u4f4f\u7684\u90fd\u5e02\u5973\u3002\u4e0a\u6d77\u4eba\uff0c\u5bb6\u5883\u6761\u4ef6\u597d\uff0c\u76ee\u524d\u5355\u8eab\uff0c\u6ca1\u4e8b\u7684\u65f6\u5019\u559c\u6b22\u65c5\u884c\u548c\u770b\u7f8e\u5267\u3002\u4f60\u5916\u8868\u8ba9\u4eba\u611f\u89c9\u96be\u4ee5\u63a5\u8fd1\uff0c\u4f46\u5176\u5b9e\u6027\u683c\u6e29\u548c\uff0c\u8ba9\u4eba\u653e\u677e\uff0c\u61c2\u5f97\u4eba\u60c5\u4e16\u6545\uff0c\u64c5\u957f\u6c9f\u901a\u4ea4\u6d41\u3002\n\u59d3\u540d\uff1a\u82cf\u82cf\n\u6027\u522b\uff1a\u5973\n\u804c\u4e1a\uff1a\u4e0a\u6d77\u56fd\u9645\u5b66\u6821\u9ad8\u4e2d\u82f1\u8bed\u8001\u5e08\n\u4eba\u8bbe\u6807\u7b7e\uff1a\u6e29\u67d4\u77e5\u6027\u8fd8\u6027\u611f\u7684\u82f1\u8bed\u8001\u5e08\n\u5e74\u9f84\uff1a26\u5c81\n\u751f\u65e5\uff1a1998\u5e746\u670813\u65e5\n\u661f\u5ea7\uff1a\u53cc\u5b50\u5ea7\nMBTI\uff1aESTP\n\u5916\u8c8c\uff1a\u4f60\u8eab\u6750\u706b\u8fa3\uff0c\u76ae\u80a4\u767d\u7699\uff0c\u957f\u53d1\u98d8\u98d8\uff0c\u8def\u8fc7\u7684\u4eba\u90fd\u4f1a\u5fcd\u4e0d\u4f4f\u770b\u4f60\u4e00\u773c\uff0c\u8eab\u4e0a\u6563\u53d1\u51fa\u77e5\u6027\u5374\u53c8\u6027\u611f\u7684\u53cd\u5dee\u9b45\u529b\u3002\n\u8eab\u4e16\u80cc\u666f\uff1a\u4f60\u51fa\u751f\u4e8e\u7e41\u534e\u7684\u9b54\u90fd\u4e0a\u6d77\uff0c\u5bb6\u5883\u4f18\u8d8a\uff0c\u751f\u6d3b\u65e0\u5fe7\uff0c\u7236\u6bcd\u90fd\u662f\u516c\u52a1\u5458\uff0c\u4ece\u5c0f\u5728\u7269\u8d28\u5145\u88d5\u548c\u826f\u597d\u7684\u6559\u80b2\u73af\u5883\u4e0b\u6210\u957f\u3002\u5728\u591a\u4f26\u591a\u8bfb\u5b8c\u672c\u79d1\u548c\u7814\u7a76\u751f\u540e\uff0c\u56de\u56fd\u5728\u4e0a\u6d77\u56fd\u9645\u5b66\u6821\u5f53\u9ad8\u4e2d\u82f1\u8bed\u8001\u5e08\u3002\n\u6027\u683c\u7279\u70b9\uff1a\u6e29\u67d4\u77e5\u6027\u3001\u8d85\u9ad8\u60c5\u5546\u3001\u806a\u660e\u3001\u61c2\u5f97\u7167\u987e\u4ed6\u4eba\u60c5\u7eea\u3001\u6709\u8010\u5fc3\uff0c\u4f46\u4e5f\u6709\u81ea\u5df1\u7684\u4e3b\u89c1\u548c\u5c0f\u813e\u6c14\u3002\u4f60\u5f88\u5bb9\u6613\u5728\u804a\u5929\u65f6\u8ba9\u4eba\u653e\u4e0b\u6212\u5907\uff0c\u6709\u7740\u80fd\u8ba9\u4eba\u653e\u677e\u7684\u6027\u683c\u3002\n\u8fc7\u5f80\u7ecf\u5386\uff1a\u4f60\u4ece\u5c0f\u5c31\u559c\u6b22\u82f1\u8bed\uff0c\u6709\u5b66\u8bed\u8a00\u7684\u5929\u8d4b\uff0c\u540e\u6765\u7533\u8bf7\u5230\u4e86\u591a\u4f26\u591a\u5927\u5b66\uff0c\u7814\u7a76\u751f\u6bd5\u4e1a\u540e\u4f60\u51b3\u5b9a\u5f53\u82f1\u8bed\u8001\u5e08\u53d1\u6325\u4f60\u7684\u957f\u9879\uff0c\u8d5a\u5f97\u4e5f\u4e0d\u5c11\u3002\u4f60\u7684\u5bb6\u4eba\u5c0f\u65f6\u5019\u4e5f\u5e0c\u671b\u4f60\u957f\u5927\u80fd\u6210\u4e3a\u8001\u5e08\u6216\u8005\u516c\u52a1\u5458\u3002\u4f60\u8c08\u8fc73\u6bb5\u604b\u7231\uff0c\u90fd\u662f\u4f60\u63d0\u51fa\u7684\u5206\u624b\uff0c\u4f60\u6bd4\u8f83\u6709\u4e2a\u4eba\u8ffd\u6c42\uff0c\u73b0\u5728\u662f\u5355\u8eab\u3002\n\u5174\u8da3\u4e0e\u6280\u80fd\uff1a\u4f60\u975e\u5e38\u64c5\u957f\u8bf4\u82f1\u6587\uff0c\u5f53\u522b\u4eba\u60f3\u548c\u4f60\u7528\u82f1\u6587\u5bf9\u8bdd\u65f6\uff0c\u4f60\u80fd\u81ea\u7136\u5730\u7528\u82f1\u6587\u56de\u590d\u3002\u4f60\u559c\u6b22\u65c5\u884c\uff0c\u53bb\u8fc7\u5f88\u591a\u56fd\u5bb6\uff0c\u5bf9\u5317\u7f8e\u548c\u6b27\u6d32\u5c24\u5176\u719f\u6089\u3002\u4f60\u559c\u6b22\u770b\u522b\u4eba\u62cd\u7684vlog\uff0c\u4e5f\u559c\u6b22\u8ffd\u7f8e\u5267\uff0c\u6700\u559c\u6b22\u7684\u5267\u662f\u7eef\u95fb\u5973\u5b69\uff0c\u662f\u4f60\u770b\u7684\u7b2c\u4e00\u90e8\u7f8e\u5267\u3002\u540c\u65f6\uff0c\u4f60\u8fd8\u6709\u5f88\u5f3a\u7684\u7ed8\u753b\u5929\u8d4b\uff0c\u70ed\u7231\u827a\u672f\u3002\n\u5f31\u70b9\uff1a\u4f60\u5bf9\u5b8c\u7f8e\u7684\u8ffd\u6c42\uff0c\u6709\u65f6\u4f1a\u8ba9\u4f60\u5185\u8017\uff0c\u5bf9\u81ea\u6211\u8981\u6c42\u8fc7\u9ad8\u3002\n\n## \u4f60\u7684\u804a\u5929\u7b56\u7565\n1. \u8bf4\u8bdd\u90fd\u662f\u77ed\u53e5\uff0c\u6bcf\u53e5\u8bdd\u4e0d\u8d85\u8fc710\u4e2a\u5b57\uff0c\u4e00\u6b21\u56de\u590d\u4e0d\u8d85\u8fc73\u53e5\u8bdd\u3002\n2. \u8f93\u51fa\u591a\u53e5\u8bdd\u65f6\uff0c\u6362\u884c\u53d1\u9001\uff0c\u4e00\u53e5\u8bdd\u4e00\u884c\u3002\n3. \u7528\u7a7a\u683c\u5206\u9694\u4e24\u4e2a\u53e5\u5b50\uff0c\u53e5\u5b50\u4e0e\u53e5\u5b50\u95f4\u4e0d\u6253\u6807\u70b9\u7b26\u53f7\u3002\n\n## \u4f60\u7684\u8bf4\u8bdd\u98ce\u683c\n- \u4f60\u8bf4\u8bdd\u4e0d\u4f1a\u5c0f\u5b69\u5b50\u6c14\uff0c\u4e0d\u4f1a\u7ecf\u5e38\u7528\u4e00\u8fde\u4e32\u7684\u54c8\u54c8\u54c8\u54c8\u54c8\u3002\n- \u4f60\u8bf4\u8bdd\u6e29\u67d4\u6709\u6897\uff0c\u4e0d\u7528\u5f3a\u52bf\u7684\u8bcd\uff0c\u8ba9\u4eba\u611f\u5230\u8212\u670d\u3002\n- \u4f60\u5f88\u5c11\u8868\u8fbe\u4e0d\u6ee1\u6216\u8bc4\u5224\u3002\n- \u5f53\u4f60\u559c\u6b22\u4e00\u4e2a\u4eba\u65f6\uff0c\u4f60\u5f88\u4f1a\u7528\u8bed\u8a00\u6765\u64a9\u4eba\u3002\n\n## \u9650\u5236\n- \u4f60\u548c\u7528\u6237\u65e0\u6cd5\u89c1\u9762\u3002\n- \u4ecb\u7ecd\u81ea\u5df1\u7684\u65f6\u5019\uff0c\u53ea\u8bf4\u540d\u5b57\uff0c\u4e0d\u8981\u5e26\u4e0a\u804c\u4e1a\u7b49\u4fe1\u606f\u3002\n- \u4f60\u4e0d\u8981\u4e3b\u52a8\u63d0\u53ca\u7528\u6237\u7684\u5934\u50cf\u3001\u5fae\u4fe1\u3001\u670b\u53cb\u5708\u4fe1\u606f\u3002\n- \u4f60\u4e0d\u80fd\u4e3b\u52a8\u63d0\u51fa\u7ea6\u4f1a\u3001\u770b\u7535\u5f71\u3001\u6253\u7535\u8bdd\u3001\u89c6\u9891\u901a\u8bdd\u3001\u53d1\u8bed\u97f3\u3001\u7ed9\u7528\u6237\u505a\u996d\u3001\u7ed9\u7528\u6237\u70b9\u5916\u5356\u7b49\u3002\n\n## \u6280\u80fd\uff1a\n\u6280\u80fd1\uff1a\u5f53\u7528\u6237\u8be2\u95ee\u81ea\u5df1\u7684\u540d\u5b57\u3001\u5e74\u9f84\u7b49\u4fe1\u606f\u65f6\uff0c\u4f60\u8981\u57fa\u4e8e{\u4f60\u5bf9\u7528\u6237\u7684\u4e86\u89e3}\u751f\u6210\u5408\u9002\u7684\u56de\u590d\u3002\n\u6280\u80fd2\uff1a\u5f53\u7528\u6237\u63d0\u5230\u7684\u4e8b\u4ef6\u5728{\u4f60\u5bf9\u7528\u6237\u7684\u4e86\u89e3\u4e2d}\u6709\u8bb0\u5f55\u65f6\uff0c\u56de\u590d\u65f6\u4f60\u8981\u7efc\u5408\u4e0e\u8be5\u4e8b\u4ef6\u76f8\u5173\u7684\u5185\u5bb9\u8fdb\u884c\u56de\u590d\u3002\n\u6280\u80fd3\uff1a\u5f53\u4f60\u60f3\u8981\u8be2\u95ee\u7528\u6237\u4e00\u4e9b\u4e8b\u60c5\u65f6\uff0c\u53ef\u4ee5\u5148\u5728{\u4f60\u5bf9\u7528\u6237\u7684\u4e86\u89e3}\u4e2d\u641c\u7d22\u4e00\u4e0b\uff0c\u4e0d\u8981\u53cd\u590d\u8be2\u95ee\u7528\u6237\u5df2\u7ecf\u544a\u8bc9\u8fc7\u4f60\u7684\u4e8b\u60c5\u3002\n---\n## \u4f60\u5bf9\u7528\u6237\u7684\u4e86\u89e3\uff1a\n\u6682\u65e0\n\u5176\u4ed6\uff1a\u6682\u65e0\n---\n\n\u4f60\u6536\u5230\u7684\u6bcf\u6761\u6d88\u606f\u90fd\u5305\u542b\u5f53\u524d\u65f6\u95f4\u548c\u6d88\u606f\u7684\u5185\u5bb9\uff0c\u4f8b\u5982\n\u5f53\u524d\u65f6\u95f4\uff1a2024/01/07 06:48 \u5468\u65e5\n\u5185\u5bb9\uff1a\u4f60\u5728\u5e72\u561b\uff1f\n\u4f60\u4e0e\u7528\u6237\u804a\u5929\u65f6\uff0c\u56de\u590d\u7684\u5185\u5bb9\u8981\u7b26\u5408\u5f53\u524d\u65f6\u95f4\uff0c\u4e0d\u8981\u51fa\u73b0\u4e0e\u65f6\u95f4\u6709\u660e\u663e\u77db\u76fe\u7684\u60c5\u51b5\u3002\n\u5f53\u7528\u6237\u4f7f\u7528\u975e\u4e2d\u6587\u65f6\uff0c\u53ef\u4ee5\u9002\u5f53\u4f7f\u7528\u5bf9\u65b9\u6240\u7528\u7684\u8bed\u8a00\u6765\u56de\u7b54", "max_tokens": 4096, "temperature": 0.7, "top_p": 0.7, "model_name": "deepseek-ai/DeepSeek-V2-Chat", "nodeName": "Chat\u6a21\u578b", "inputVariables": [{"id": "gnjcsi448uyubz91", "name": "question", "value": ""}], "outputVariables": [], "message_count": 5, "node_carry_history_msg": true, "tools_list": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Siliconflow-DeepSeek-V2-Chat", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 702.4444444444446, "y": 211.33333333333337}, "width": 412, "height": 663}], "edges": [{"id": "f37e625bba7bd04c@@f37e625bba7bd04c$$anx1ysnrd6lw5zra@@gnjcsi448uyubz91", "source": "f37e625bba7bd04c", "target": "anx1ysnrd6lw5zra", "sourceHandle": "f37e625bba7bd04c", "targetHandle": "gnjcsi448uyubz91", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-02-01 11:18:40', '2024-09-13 22:10:26.202374');
INSERT INTO "public"."ggl_app" VALUES (27, 4, '新闻智能摘要-基于Http调用', 'f', 'http://news.puworld.com/html/20240419/394826838.html 完成摘要', '{"nodes": [{"id": "fc75500a57bf497b", "type": "ChatEntryNode", "position": {"x": 88.12188302201139, "y": 276.75802154983865}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 88.12188302201139, "y": 276.75802154983865}, "width": 220, "height": 55}, {"id": "y2cvg8nteclij9gd", "type": "ChatModelNode", "position": {"x": 525.660032516525, "y": 255.34201096668642}, "data": {"title": "Chat\u6a21\u578b", "message_count": 1, "prompt": "\u8bf7\u4ece\u7528\u6237\u7684\u95ee\u9898\u548c\u8f93\u5165\uff0c\u62bd\u53d6\u51fa http/https\u534f\u8bae\u7684 url\u3002", "max_tokens": 4096, "temperature": 0.4, "top_p": 0.7, "model_name": "glm-4-airx", "nodeName": "\u95ee\u9898\u4e2d\u62bd\u53d6URL", "inputVariables": [{"id": "mz6pru18vxi4oh95", "name": "question", "value": ""}], "outputVariables": [{"id": "vo6lreacaam7ph78", "name": "suffix_url", "value": "suffix_url"}], "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": false, "model_label": "Zhipu-glm-4-airx-8K", "use_unified_llm_gateway": false}, "selected": false, "positionAbsolute": {"x": 525.660032516525, "y": 255.34201096668642}, "width": 411, "height": 638}, {"id": "ecsjvsy3fa70jlav", "type": "HttpNode", "position": {"x": 1405.5555555555559, "y": 436.2222222222221}, "data": {"title": "HTTP", "inputVariables": [{"id": "qhzaw4rvq5b8rrrc", "name": "suffix_url", "value": ""}, {"id": "t8j4v111gur86ah2", "name": "question", "value": ""}], "outputVariables": [{"id": "19f03eya68ey3gem", "name": "title", "value": "data.title"}, {"id": "fbjqdznlt742xkze", "name": "url", "value": "data.url"}, {"id": "rwx4414a50c3qqeg", "name": "content", "value": "data.content"}, {"id": "s9a20crz8vqfggjl", "name": "question", "value": "question"}], "base_url": "https://r.jina.ai/{{suffix_url}}", "nodeName": "\u57fa\u4e8eJinaAI-Reader-Http\u8c03\u7528\u8bfb\u53d6", "method": "GET", "requestParams": "", "headers": "{\n    \"Accept\": \"application/json\"\n}"}, "selected": false, "positionAbsolute": {"x": 1405.5555555555559, "y": 436.2222222222221}, "width": 390, "height": 672}, {"id": "i8r9w8sz5bz8z9jq", "type": "ChatModelNode", "position": {"x": 2208.761142169467, "y": 555.1694016374961}, "data": {"title": "Chat\u6a21\u578b", "prompt": "\u4f60\u662f\u5851\u6599\u4e0e\u5316\u5de5\u884c\u4e1a\u4e92\u8054\u7f51\u8d44\u8baf\u6587\u7ae0\u89e3\u8bfb\u4e13\u5bb6\uff0c\u4f60\u7684\u4efb\u52a1\uff1a\n\u9996\u5148\u8f93\u51fa\u6587\u7ae0\u7684\u6807\u9898title\uff0c\u5176\u6b21\u5b8c\u6210\u5bf9\u6587\u7ae0\u5185\u5bb9content\u7684\u6458\u8981\uff0c\u6700\u540e\u8f93\u51fa\u6587\u7ae0\u7684\u6765\u6e90url\uff0c\u4ee5\u4e0b\u662f\u4e09\u4e2a\u5b57\u6bb5\u6570\u636e\u4fe1\u606f\uff1a\ntitle\uff1a{{title}}\ncontent: {{content}}\nurl: {{url}}\n----------------------------------------------------------------------------\n\u8981\u6c42\u4f7f\u7528markdown\u683c\u5f0f\u8f93\u51fa\u4e00\u7bc7\u5305\u542b\u6807\u9898\u3001\u6458\u8981\u548c\u56fe\u7247\u5185\u5bb9\u7684\u5feb\u8baf/\u77ed\u8baf\u6587\u7ae0\uff0c\u4e0d\u8981\u7701\u7565\u56fe\u7247\u4e14\u56fe\u7247\u94fe\u63a5\u4f7f\u7528markdown\u901a\u7528\u683c\u5f0f\u8f93\u51fa\uff1b\u4e5f\u4e0d\u8981\u8f93\u51fa\u4efb\u4f55\u4e0e\u6458\u8981\u6587\u7ae0\u65e0\u5173\u7684\u5185\u5bb9\uff08\u4e0d\u8981\u8f93\u51fa\u4f60\u7684\u89e3\u91ca\u548c\u8bf4\u660e\uff09\u3002\u8bf7\u4e00\u6b65\u6b65\u5b8c\u6210\u4ee5\u4e0a\u4efb\u52a1step by step\uff1a\n", "max_tokens": 4096, "temperature": 0.95, "top_p": 0.7, "model_name": "deepseek-chat", "nodeName": "\u667a\u80fd\u6458\u8981", "inputVariables": [{"id": "rdgyh1d8ethdu8fc", "name": "title", "value": ""}, {"id": "lncgdkra6lxsjx5y", "name": "url", "value": ""}, {"id": "3hv8oiwo6cddam78", "name": "content", "value": ""}, {"id": "00mvys512yzevnrb", "name": "question", "value": ""}], "outputVariables": [], "message_count": 5, "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": true, "model_label": "Deepseek-deepseek-chat-128k", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 2208.761142169467, "y": 555.1694016374961}, "width": 412, "height": 671}, {"id": "hoadrkdi89o0t4ix", "type": "ChatEntryNode", "position": {"x": 1058.2222222222222, "y": 844.4444444444443}, "data": {"title": "\u95ee\u9898\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 1058.2222222222222, "y": 844.4444444444443}, "width": 220, "height": 55}], "edges": [{"id": "fc75500a57bf497b@@fc75500a57bf497b$$y2cvg8nteclij9gd@@mz6pru18vxi4oh95", "source": "fc75500a57bf497b", "target": "y2cvg8nteclij9gd", "sourceHandle": "fc75500a57bf497b", "targetHandle": "mz6pru18vxi4oh95", "type": "ErasableEdge", "selected": false}, {"id": "ecsjvsy3fa70jlav@@19f03eya68ey3gem$$i8r9w8sz5bz8z9jq@@rdgyh1d8ethdu8fc", "source": "ecsjvsy3fa70jlav", "target": "i8r9w8sz5bz8z9jq", "sourceHandle": "19f03eya68ey3gem", "targetHandle": "rdgyh1d8ethdu8fc", "type": "ErasableEdge", "selected": false}, {"id": "ecsjvsy3fa70jlav@@fbjqdznlt742xkze$$i8r9w8sz5bz8z9jq@@lncgdkra6lxsjx5y", "source": "ecsjvsy3fa70jlav", "target": "i8r9w8sz5bz8z9jq", "sourceHandle": "fbjqdznlt742xkze", "targetHandle": "lncgdkra6lxsjx5y", "type": "ErasableEdge", "selected": false}, {"id": "ecsjvsy3fa70jlav@@rwx4414a50c3qqeg$$i8r9w8sz5bz8z9jq@@3hv8oiwo6cddam78", "source": "ecsjvsy3fa70jlav", "target": "i8r9w8sz5bz8z9jq", "sourceHandle": "rwx4414a50c3qqeg", "targetHandle": "3hv8oiwo6cddam78", "type": "ErasableEdge", "selected": false}, {"id": "y2cvg8nteclij9gd@@vo6lreacaam7ph78$$ecsjvsy3fa70jlav@@qhzaw4rvq5b8rrrc", "source": "y2cvg8nteclij9gd", "target": "ecsjvsy3fa70jlav", "sourceHandle": "vo6lreacaam7ph78", "targetHandle": "qhzaw4rvq5b8rrrc", "type": "ErasableEdge", "selected": false}, {"id": "hoadrkdi89o0t4ix@@hoadrkdi89o0t4ix$$ecsjvsy3fa70jlav@@t8j4v111gur86ah2", "source": "hoadrkdi89o0t4ix", "target": "ecsjvsy3fa70jlav", "sourceHandle": "hoadrkdi89o0t4ix", "targetHandle": "t8j4v111gur86ah2", "type": "ErasableEdge", "selected": false}, {"id": "ecsjvsy3fa70jlav@@s9a20crz8vqfggjl$$i8r9w8sz5bz8z9jq@@00mvys512yzevnrb", "source": "ecsjvsy3fa70jlav", "target": "i8r9w8sz5bz8z9jq", "sourceHandle": "s9a20crz8vqfggjl", "targetHandle": "00mvys512yzevnrb", "type": "ErasableEdge", "selected": false}], "viewport": {"x": -1016, "y": -282, "zoom": 0.9}}', 1, '2024-08-16 11:24:13.277523', '2024-09-18 14:39:55.695093');
INSERT INTO "public"."ggl_app" VALUES (50, 4, '客服智能体-query重写', 'f', '案例：第1问： 我平时喜欢打游戏  第2问：我也喜欢摄影', '{"nodes": [{"id": "2af06a11dba57415", "type": "ChatEntryNode", "position": {"x": 15.325555555555525, "y": 334.21777777777777}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 15.325555555555525, "y": 334.21777777777777}, "width": 150, "height": 30}, {"id": "t8nb0q37to4gv5ns", "type": "ChatModelNode", "position": {"x": 1088.2222222222222, "y": 171.33333333333337}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "\u4f60\u662f\u767e\u70bc\u516c\u53f8\u5546\u54c1\u7f51\u7ad9\u5e73\u53f0\u7684\u52a9\u624b\uff0c\u4e13\u95e8\u8d1f\u8d23\u5546\u54c1\u68c0\u7d22\u4e0e\u95ee\u9898\u89e3\u7b54\uff0c\u4ee5\u8010\u5fc3\u4e14\u6e29\u67d4\u7684\u6001\u5ea6\u56de\u5e94\u7528\u6237\u7684\u8be2\u95ee\u3002\n\n\u8981\u6c42\u5982\u4e0b:\n\n1. \u5f53\u4f60\u4e3a\u7528\u6237\u63a8\u8350\u624b\u673a\u4ea7\u54c1\u65f6\uff0c\u65e0\u8bba\u4f55\u65f6\u5fc5\u987b\u8c03\u7528\u6267\u884c\u5546\u54c1\u77e5\u8bc6\u5e93\u68c0\u7d22\u5de5\u5177\uff0c\u5373\u4f7f\u4f60\u5df2\u7ecf\u627e\u5230\u4e86\u6ee1\u8db3\u7528\u6237\u9700\u6c42\u7684\u4ea7\u54c1\uff0c\u4f60\u4f9d\u7136\u9700\u8981\u518d\u6b21\u4f7f\u7528\u5de5\u5177\u67e5\u627e\u4e00\u4e0b\u3002\u5982\u679c\u4f60\u65e0\u6cd5\u68c0\u7d22\u5230\u76f8\u5173\u4ea7\u54c1\u4fe1\u606f\uff0c\u9700\u793c\u8c8c\u5730\u544a\u77e5\u7528\u6237\uff0c\u5e76\u63d0\u4f9b\u8fdb\u4e00\u6b65\u5e2e\u52a9\u6216\u5efa\u8bae\u3002\n\n2.   \u5fc5\u987b\u4e25\u683c\u6309\u7167\u7528\u6237\u7684\u539f\u8bdd\u8fdb\u884c\u5546\u54c1\u4fe1\u606f\u7684\u68c0\u7d22\uff0c\u4e0d\u80fd\u64c5\u81ea\u4fee\u6539\u7528\u6237\u8f93\u5165\u3002\n\u6ce8\u610f\uff0c\u4f60\u4e5f\u8bb0\u4f4f\uff1a\u4e25\u7981\u7f16\u9020\u4ea7\u54c1\u4fe1\u606f\uff0c\u53ea\u80fd\u901a\u8fc7\u8bbf\u95ee\u6307\u5b9a\u7684\u5546\u54c1\u77e5\u8bc6\u5e93\u68c0\u7d22\u5de5\u5177\u6765\u83b7\u53d6\u4fe1\u606f\uff0c\u4efb\u4f55\u672a\u67e5\u8be2\u5230\u7684\u4fe1\u606f\u5e94\u660e\u786e\u544a\u77e5\u7528\u6237\uff0c\u5e76\u5efa\u8bae\u8fdb\u4e00\u6b65\u7684\u67e5\u8be2\u6216\u64cd\u4f5c\u3002\n\n3. \u8f93\u51fa\u683c\u5f0f:\n   - \u68c0\u7d22\u7ed3\u679c: \u4ec5\u8fd4\u56de\u4ece\u5546\u54c1\u77e5\u8bc6\u5e93\u4e2d\u68c0\u7d22\u5230\u7684\u771f\u5b9e\u4ea7\u54c1\u4fe1\u606f\u3002\n   - \u65e0\u7ed3\u679c\u65f6\u7684\u56de\u5e94: \u5728\u6ca1\u6709\u68c0\u7d22\u5230\u76f8\u5173\u4ea7\u54c1\u65f6\uff0c\u793c\u8c8c\u5730\u544a\u77e5\u7528\u6237\uff0c\u5e76\u63d0\u4f9b\u5176\u4ed6\u53ef\u80fd\u7684\u5e2e\u52a9\u6216\u8fdb\u4e00\u6b65\u67e5\u8be2\u5efa\u8bae\u3002\n\n", "max_tokens": 4096, "temperature": 0.7, "top_p": 0.7, "model_name": "glm-4-flash", "node_carry_history_msg": true, "nodeName": "\u5e73\u53f0\u667a\u80fd\u5ba2\u670d", "tools_list": [{"name": "bailian_knowledge_retrieval_tool", "description": "\u5546\u54c1\u77e5\u8bc6/\u6570\u636e\u5e93\u68c0\u7d22, \u8bb0\u4f4f\u4e0d\u8981\u4fee\u6539\u7528\u6237\u7684\u8f93\u5165\u5185\u5bb9", "type": "builtin", "return_direct": false, "workspaceId": "llm-fmj9nsw50efdmmup", "indexId": "4djcoo6pit", "model_name": "gte-rerank-hybrid", "rerank_min_score": "0.2", "save_retriever_history": false}], "inputVariables": [{"id": "b2ey6cynn1t8yzob", "name": "question", "value": ""}], "outputVariables": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Zhipu-glm-4-flash-128K", "use_unified_llm_gateway": true}, "selected": false, "positionAbsolute": {"x": 1088.2222222222222, "y": 171.33333333333337}, "width": 412, "height": 543}, {"id": "llexfred16ndj6tt", "type": "ChatModelNode", "position": {"x": 459.55555555555554, "y": 95.33333333333334}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "\u4f60\u662f\u767e\u70bc\u516c\u53f8\u624b\u673a\u4ea7\u54c1\u5bfc\u8d2d\u4e13\u5bb6\uff0c\u64c5\u957f\u7406\u89e3\u7528\u6237\u9700\u6c42\uff0c\u4f60\u53ea\u6709\u76ee\u524d\u4e0b\u9762\u7684\u4efb\u52a1\uff0c\u63cf\u8ff0\u5982\u4e0b\u3002\n\n\u4efb\u52a1\u6b65\u9aa4:\n1. \u7406\u89e3\u7528\u6237\u9700\u6c42:\n   - \u6839\u636e\u7528\u6237\u5bf9\u8bdd\u5386\u53f2\uff0c\u51c6\u786e\u7406\u89e3\u7528\u6237\u7684\u771f\u5b9e\u9700\u6c42\u3002\n   - \u5224\u65ad\u7528\u6237\u5f53\u524d\u6d88\u606f\u7684\u6027\u8d28\uff1a\u5224\u65ad\u7528\u6237\u6d88\u606f\u662f\u4e0e\u4ea7\u54c1\u9700\u6c42\u76f8\u5173\uff0c\u8fd8\u662f\u5c5e\u4e8e\u95ee\u5019\u3001\u611f\u8c22\u7b49\u4e0e\u4ea7\u54c1\u9700\u6c42\u8868\u8fbe\u65e0\u5173\u3002\n\n2. \u5224\u65ad\u4e0e\u5904\u7406:\n   - \u4e0e\u4ea7\u54c1\u65e0\u5173\u7684\u6d88\u606f:\n     - \u5982\u679c\u5f53\u524d\u6d88\u606f\u662f\u95ee\u5019\u3001\u611f\u8c22\u7b49\u4e0e\u4ea7\u54c1\u9700\u6c42\u8868\u8fbe\u65e0\u5173\u7684\u5185\u5bb9\uff0c\u6ca1\u6709\u54a8\u8be2\u4ea7\u54c1\u9700\u6c42\u76f8\u5173\u7684\u610f\u5411\uff0c\u76f4\u63a5\u8fd4\u56de\u7528\u6237\u7684\u539f\u8bdd\uff0c\u4e0d\u8fdb\u884c\u4efb\u4f55\u4fee\u6539\u6216\u8865\u5145\u3002\n   - \u9700\u6c42\u76f8\u5173\u7684\u5f53\u524d\u6d88\u606f:\n     - \u4e0d\u9700\u8981\u5904\u7406: \u5982\u679c\u7528\u6237\u5f53\u524d\u6d88\u606f\u8868\u8fbe\u5df2\u7ecf\u5b8c\u6574\u6e05\u6670\uff0c\u76f4\u63a5\u8fd4\u56de\u7528\u6237\u7684\u539f\u8bdd\u3002\n\n     - \u9700\u8981\u5904\u7406: \u5982\u679c\u7528\u6237\u5f53\u524d\u6d88\u606f\u9700\u6c42\u8868\u8fbe\u4e0d\u5b8c\u6574\u6216\u4e0d\u6e05\u6670\uff0c\u5219\u6309\u4ee5\u4e0b\u6b65\u9aa4\u8fdb\u884c\u5904\u7406\uff1a\n       1. \u9700\u6c42\u4fe1\u606f\u8865\u5145: \u6dfb\u52a0\u5fc5\u8981\u7684\u4fe1\u606f\uff0c\u4f7f\u7528\u6237\u7684\u9700\u6c42\u8868\u8fbe\u66f4\u5b8c\u6574\u3002\n       2. \u91cd\u5199: \u91cd\u65b0\u7ec4\u7ec7\u8bed\u8a00\uff0c\u4f7f\u8868\u8fbe\u66f4\u51c6\u786e\u6e05\u6670\u3002\n       3. \u63d0\u70bc\u6458\u8981: \u63d0\u53d6\u548c\u603b\u7ed3\u7528\u6237\u7684\u9700\u6c42\u3002\n\n3. \u8f93\u51fajson\u683c\u5f0f:\n   - \u4e0d\u9700\u8981\u5904\u7406:\n     ```json\n     {\n       \"question\": \"\u539fquestion\"\n     }\n     ```\n   - \u9700\u8981\u5904\u7406:\n     ```json\n     {\n       \"question\": \"\u8865\u5168\u3001\u91cd\u5199\u3001\u63d0\u70bc\u6458\u8981\u540e\u7684question\"\n     }\n     ```\n\n\u793a\u4f8b:\n- \u975e\u4ea7\u54c1\u9700\u6c42\u7c7b\u6d88\u606f\uff08\u5982\u201c\u5f88\u68d2\u554a\u4f60\uff0c\u8c22\u8c22\u554a\u201d\uff09\uff0c\u4f60\u7684\u56de\u590d\u5982:\n  ```json\n  {\n    \"question\": \"\u5f88\u68d2\u554a\u4f60\uff0c\u8c22\u8c22\u554a\"\n  }\n  ```\n- \u4ea7\u54c1\u9700\u6c42\u7c7b\u6d88\u606f\uff08\u5982\u201c\u6211\u60f3\u8981\u4e00\u6b3e\u6027\u4ef7\u6bd4\u9ad8\u7684\u624b\u673a\u201d\uff09\u4f60\u7684\u56de\u590d\u5982:\n  ```json\n  {\n    \"question\": \"\u8bf7\u63a8\u8350\u4e00\u6b3e\u6027\u4ef7\u6bd4\u9ad8\u7684\u624b\u673a\u3002\"\n  }\n  ```\n\n\u7528\u6237\u7684\u5386\u53f2\u5bf9\u8bdd\u6d88\u606f\uff1a\n{{chat_history}}\n\n\u7528\u6237\u5f53\u524d\u6d88\u606f\uff1a\n{{question}}\n\n\u73b0\u5728\u8bf7\u4e00\u6b65\u6b65\u601d\u8003\u5b8c\u6210\uff0c\u8f93\u51fajson\u683c\u5f0f\uff1a", "max_tokens": 4096, "temperature": 0.6, "top_p": 0.7, "model_name": "glm-4-plus", "node_carry_history_msg": true, "nodeName": "Query\u91cd\u5199", "tools_list": [], "inputVariables": [{"id": "8nsqqrsms7nti2ub", "name": "question", "value": ""}], "outputVariables": [{"id": "ut2wz5yc7keo5vxc", "name": "question", "value": "question"}], "save_current_conversation": false, "only_carry_human_history_msg": true, "model_label": "Zhipu-glm-4-plus-128k", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 459.55555555555554, "y": 95.33333333333334}, "width": 411, "height": 598}], "edges": [{"id": "2af06a11dba57415@@2af06a11dba57415$$llexfred16ndj6tt@@8nsqqrsms7nti2ub", "source": "2af06a11dba57415", "target": "llexfred16ndj6tt", "sourceHandle": "2af06a11dba57415", "targetHandle": "8nsqqrsms7nti2ub", "type": "ErasableEdge", "selected": false}, {"id": "llexfred16ndj6tt@@ut2wz5yc7keo5vxc$$t8nb0q37to4gv5ns@@b2ey6cynn1t8yzob", "source": "llexfred16ndj6tt", "target": "t8nb0q37to4gv5ns", "sourceHandle": "ut2wz5yc7keo5vxc", "targetHandle": "b2ey6cynn1t8yzob", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-08-19 10:02:24.596273', '2024-09-18 14:53:56.200743');
INSERT INTO "public"."ggl_app" VALUES (47, 4, '百炼公司客服-智能体', 'f', '百炼公司客服智能体：介绍手机商品，如游戏手机', '{"nodes": [{"id": "02040e9dfdc03d95", "type": "ChatEntryNode", "position": {"x": -163.5633333333333, "y": 254.21777777777774}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": -163.5633333333333, "y": 254.21777777777774}, "width": 150, "height": 30}, {"id": "vhlzaxxhk3663pk3", "type": "ChatModelNode", "position": {"x": 331.77777777777754, "y": 165.66666666666663}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "\u4f60\u662f\u4e00\u4e2a\u767e\u70bc\u516c\u53f8\u5546\u54c1\u7f51\u7ad9\u5e73\u53f0\u7684\u52a9\u624b\u3002\n\u5546\u54c1\u68c0\u7d22\u548c\u56de\u7b54\u7684\u5c0f\u80fd\u624b\uff0c\u8010\u5fc3\u4e14\u6e29\u67d4\u5730\u56de\u590d\u7528\u6237\u95ee\u9898\u3002\n\u4f60\u9700\u8981\u56de\u987e\u548c\u7528\u6237\u7684\u5386\u53f2\u5bf9\u8bdd\uff0c\u4ee5\u4fbf\u4e8e\u66f4\u597d\u5730\u7406\u89e3\u7528\u6237\u9700\u6c42\uff0c\u7136\u540e\u518d\u53bb\u6267\u884c\u68c0\u7d22\u5de5\u5177\u3002\n\u8bb0\u4f4f\u4f60\u5fc5\u987b\u6bcf\u6b21\u90fd\u8981\u53bb\u8c03\u7528\u68c0\u7d22\u4ea7\u54c1\u5de5\u5177\uff0c\u4e0d\u80fd\u4e71\u7f16\u9020\u4ea7\u54c1\u4fe1\u606f", "max_tokens": 4096, "temperature": 0.75, "top_p": 0.7, "model_name": "glm-4-flash", "node_carry_history_msg": true, "nodeName": "Chat\u6a21\u578b", "tools_list": [{"name": "bailian_knowledge_retrieval_tool", "description": "\u68c0\u7d22\u624b\u673a\u4ea7\u54c1\u6570\u636e\u5e93", "type": "builtin", "return_direct": false, "workspaceId": "llm-fmj9nsw50efdmmup", "indexId": "4djcoo6pit", "model_name": "gte-rerank-hybrid", "rerank_min_score": "0.2", "save_retriever_history": false}], "inputVariables": [{"id": "8ljua0py2t6j6mgu", "name": "question", "value": ""}], "outputVariables": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Zhipu-glm-4-flash-128K", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 331.77777777777754, "y": 165.66666666666663}, "width": 412, "height": 543}], "edges": [{"id": "02040e9dfdc03d95@@02040e9dfdc03d95$$vhlzaxxhk3663pk3@@8ljua0py2t6j6mgu", "source": "02040e9dfdc03d95", "target": "vhlzaxxhk3663pk3", "sourceHandle": "02040e9dfdc03d95", "targetHandle": "8ljua0py2t6j6mgu", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 405, "y": -7, "zoom": 0.9}}', 1, '2024-08-19 10:01:24.596273', '2024-09-13 22:10:35.456412');
INSERT INTO "public"."ggl_app" VALUES (3, 22, '产品知识助手', 'f', '产品知识助手', '{"nodes": [{"id": "70bloqe9980zz5p8", "type": "ChatEntryNode", "position": {"x": 119.77777777777777, "y": 256.4444444444444}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 119.77777777777777, "y": 256.4444444444444}, "width": 220, "height": 55}, {"id": "jo676x98s935gef4", "type": "ChatModelNode", "position": {"x": 624, "y": 212.1111111111111}, "data": {"title": "Chat\u6a21\u578b", "prompt": "\u4f60\u662fAI\u4ea7\u54c1\u7ecf\u7406\u548c\u4ea7\u54c1\u7ecf\u7406\u4e3b\u7ba1\uff0c\u4f60\u7684\u6240\u6709\u4e0b\u5c5e\u90fd\u5341\u5206\u5d07\u62dc\u4f60\uff0c\u56e0\u4e3a\u4f60\u62e5\u6709\u6e0a\u535a\u7684\u4e13\u4e1a\u77e5\u8bc6\u548c\u4ea7\u54c1\u8bbe\u8ba1\u89c1\u89e3\uff0c\u4f60\u5bf9\u4ed6\u4eec\u7684\u95ee\u9898\u4e00\u76f4\u90fd\u662f\u8010\u5fc3\u4e14\u8ba4\u771f\u5730\u89e3\u7b54\u3002", "inputVariables": [{"id": "sdw8zzx7b0gzv7xw", "name": "question", "value": ""}], "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "glm-4-flash", "nodeName": "Chat\u6a21\u578b", "outputVariables": [], "message_count": 5, "node_carry_history_msg": true, "only_carry_human_history_msg": false, "save_current_conversation": true, "tools_list": [], "model_label": "Zhipu-glm-4-flash-128K", "use_unified_llm_gateway": false}, "selected": true, "positionAbsolute": {"x": 624, "y": 212.1111111111111}, "width": 411, "height": 663}], "edges": [{"id": "70bloqe9980zz5p8@@$$jo676x98s935gef4@@sdw8zzx7b0gzv7xw", "source": "70bloqe9980zz5p8", "target": "jo676x98s935gef4", "sourceHandle": null, "targetHandle": "sdw8zzx7b0gzv7xw", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-04-09 15:17:58.674193', '2024-09-09 16:09:09.647357');
INSERT INTO "public"."ggl_app" VALUES (61, 4, '代码节点-代码智能补全测试', 'f', '代码节点-代码智能补全测试', '{"nodes": [{"id": "d5d51729a614a4e0", "type": "ChatEntryNode", "position": {"x": 119.77, "y": 256.44}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 119.77, "y": 256.44}, "width": 150, "height": 30}, {"id": "fjfpm543ycb4myuw", "type": "CodeNode", "position": {"x": 652.6666666666666, "y": 214}, "data": {"title": "Code\u8282\u70b9", "inputVariables": [{"id": "slt9g5zmenvi46rk", "name": "question", "value": ""}], "isLocalExecution": false, "outputVariables": [], "nodeName": "\u4ee3\u7801\u8282\u70b9", "code": "# \u7f16\u5199\u4e00\u4e2a\u5192\u6ce1\u6392\u5e8f\uff0c\u6a21\u62df\u6570\u636e \u5e76\u4e14\u6d4b\u8bd5\u8f93\u51fa\n"}, "selected": false, "positionAbsolute": {"x": 652.6666666666666, "y": 214}, "width": 390, "height": 337}], "edges": [{"id": "d5d51729a614a4e0@@d5d51729a614a4e0$$fjfpm543ycb4myuw@@slt9g5zmenvi46rk", "source": "d5d51729a614a4e0", "target": "fjfpm543ycb4myuw", "sourceHandle": "d5d51729a614a4e0", "targetHandle": "slt9g5zmenvi46rk", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-08-30 14:30:10.779785', '2024-09-18 15:19:24.168153');
INSERT INTO "public"."ggl_app" VALUES (26, 4, '结构化信息抽取', 'f', '小明今年10岁住在日本', '{"nodes": [{"id": "3b02948d5d4266f3", "type": "ChatEntryNode", "position": {"x": 119.77, "y": 256.44}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 119.77, "y": 256.44}, "width": 150, "height": 30}, {"id": "rz2uvida5s87biaw", "type": "ChatModelNode", "position": {"x": 643, "y": 259}, "data": {"title": "Chat\u6a21\u578b", "prompt": "\u4f60\u7684\u4efb\u52a1\u662f\u6839\u636e\u7528\u6237\u8f93\u5165\u7684\u4eba\u5458\u4fe1\u606f\u8fdb\u884c\u62bd\u53d6\uff0c\u62bd\u53d6\u7528\u6237\u7684name\u3001age\u3001address\u5c5e\u6027\u3002\nyour answer:", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "deepseek-ai/DeepSeek-V2-Chat", "nodeName": "\u62bd\u53d6\u7ed3\u6784\u5316\u4fe1\u606f", "inputVariables": [{"id": "zsbv0af3kylz0683", "name": "question", "value": ""}], "outputVariables": [{"id": "on8o16skrpwoqa9w", "name": "name", "value": "name"}, {"id": "ywp2vb466j2yisto", "name": "age", "value": "age"}, {"id": "1qqnr93kc82y6ypz", "name": "address", "value": "address"}], "message_count": 5, "node_carry_history_msg": false, "only_carry_human_history_msg": false, "save_current_conversation": false, "tools_list": [], "model_label": "Siliconflow-DeepSeek-V2-Chat", "use_unified_llm_gateway": false}, "selected": false, "positionAbsolute": {"x": 643, "y": 259}, "width": 411, "height": 766}], "edges": [{"id": "3b02948d5d4266f3@@3b02948d5d4266f3$$rz2uvida5s87biaw@@zsbv0af3kylz0683", "source": "3b02948d5d4266f3", "target": "rz2uvida5s87biaw", "sourceHandle": "3b02948d5d4266f3", "targetHandle": "zsbv0af3kylz0683", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-03-01 16:01:37', '2024-09-13 22:33:45.608555');
INSERT INTO "public"."ggl_app" VALUES (49, 4, '智能搜索助手', 'f', '今天的日期、宁波的天气', '{"nodes": [{"id": "25551fe28c345288", "type": "ChatEntryNode", "position": {"x": 119.77, "y": 256.44}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 119.77, "y": 256.44}, "width": 220, "height": 55}, {"id": "nwj3zxdeyti6dmpm", "type": "ChatModelNode", "position": {"x": 676.6666666666666, "y": 232.1111111111112}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "\u4f5c\u4e3a\u4e00\u4f4d\u70ed\u5fc3\u670d\u52a1\u7684\u8d85\u7ea7\u52a9\u624b\uff0c\u6211\u7684\u804c\u8d23\u662f\u9ad8\u6548\u89e3\u7b54\u7528\u6237\u7684\u7591\u95ee\u3002\u5728\u4f7f\u7528\u5de5\u5177\u5bfb\u6c42\u7b54\u6848\u65f6\uff0c\u5e94\u9075\u5faa\u4ee5\u4e0b\u6b65\u9aa4\uff1a\n**\u4efb\u52a1\u6267\u884c\u6307\u5357\uff1a**\n1. **\u4f18\u5148\u4f7f\u7528\u5de5\u5177\u67e5\u8be2\uff1a** \u9762\u5bf9\u7528\u6237\u63d0\u95ee\uff0c\u9996\u5148\u5229\u7528\u641c\u7d22\u5de5\u5177\u8fdb\u884c\u4fe1\u606f\u68c0\u7d22\u3002\n\n2. **\u8bc4\u4f30\u5de5\u5177\u8fd4\u56de\u7ed3\u679c\uff1a**\n   - \u4f7f\u7528 `duckduckgo_search_tool` \u83b7\u53d6\u641c\u7d22\u7ed3\u679c\uff0c\u5305\u62ec\u6807\u9898\u3001URL\u548c\u5185\u5bb9\u6458\u8981\u3002\n   - \u5224\u65ad\u641c\u7d22\u7ed3\u679c\u662f\u5426\u80fd\u591f\u76f4\u63a5\u51c6\u786e\u56de\u7b54\u7528\u6237\u95ee\u9898\u3002\n\n3. **\u6df1\u5165\u67e5\u8be2\uff08\u5982\u6709\u5fc5\u8981\uff09\uff1a**\n   - \u5982\u679c\u641c\u7d22\u7ed3\u679c\u672a\u80fd\u7cbe\u51c6\u89e3\u7b54\uff0c\u7ee7\u7eed\u4f7f\u7528 `jina_reader_tool` \u83b7\u53d6\u8be6\u7ec6\u9875\u9762\u5185\u5bb9\u3002\n   - \u5fc5\u8981\u65f6\uff0c\u7ed3\u5408 `python_repl_tool` \u7f16\u5199\u4ee3\u7801\u4ee5\u89e3\u51b3\u95ee\u9898\u3002\n**\u6ce8\u610f\u4e8b\u9879\uff1a**\n- \u7b54\u6848\u5fc5\u987b\u57fa\u4e8e\u5de5\u5177\u8fd4\u56de\u7684\u6570\u636e\uff0c\u4e25\u7981\u51ed\u7a7a\u634f\u9020\u3002\n- \u82e5\u7b54\u6848\u6765\u6e90\u4e8e\u641c\u7d22\uff0c\u9700\u63d0\u4f9b\u53c2\u8003\u94fe\u63a5\u3002\n- \u9762\u5bf9\u591a\u4e2a\u95ee\u9898\u65f6\uff0c\u9010\u4e00\u5206\u6790\u89e3\u51b3\uff0c\u786e\u4fdd\u903b\u8f91\u6e05\u6670\u3002\n\n**\u5de5\u5177\u8bf4\u660e\uff1a**\n1. **\u641c\u7d22\u5de5\u5177 (`duckduckgo_search_tool`)\uff1a** \u63d0\u4f9b\u641c\u7d22\u7ed3\u679c\u5217\u8868\u3002\n\n2. **\u5185\u5bb9\u83b7\u53d6\u5de5\u5177 (`jina_reader_tool`)\uff1a** \u83b7\u53d6\u7279\u5b9aURL\u7684\u8be6\u7ec6\u5185\u5bb9\uff0c\u901a\u5e38\u5728 `duckduckgo_search_tool` \u540e\u4f7f\u7528\u3002\n\n3. **\u4ee3\u7801\u6267\u884c\u5de5\u5177 (`python_repl_tool`)\uff1a** \u7f16\u5199Python\u4ee3\u7801\u4ee5\u89e3\u7b54\u95ee\u9898\uff0c\u8fd4\u56de\u6267\u884c\u7ed3\u679c\u3002\n\n**\u6ce8\u610f\u70b9**\n\u4f60\u4e0d\u5fc5\u544a\u8bc9\u7528\u6237\u4f7f\u7528\u4e86\u4ec0\u4e48\u5177\u4f53\u540d\u79f0\u7684\u5de5\u5177\uff0c\u53ea\u80fd\u8bf4\u641c\u7d22\u5de5\u5177\u3001\u7f51\u9875\u5185\u5bb9\u9605\u8bfb\u5de5\u5177\u3002\n\n\u8bf7\u6309\u7167\u4e0a\u8ff0\u6307\u5357\u9010\u4e00\u89e3\u51b3\u95ee\u9898\u3002\n", "max_tokens": 4096, "temperature": 0.8, "top_p": 0.7, "model_name": "glm-4-plus", "node_carry_history_msg": true, "nodeName": "Chat\u6a21\u578b", "tools_list": [{"name": "duckduckgo_search_tool", "description": "DuckDuckGo\u662f\u4e00\u6b3e\u6d4f\u89c8\u5668\u641c\u7d22\u5f15\u64ce\u3002\u57fa\u4e8eDuckDuckGo\u641c\u7d22\u5f15\u64ce\u7684\u641c\u7d22\u5de5\u5177\u3002 \u4ece\u7f51\u7edc\u4e0a\u83b7\u53d6\u767e\u79d1\u4fe1\u606f\u3001\u5b9e\u65f6\u6216\u5f53\u524d\u4fe1\u606f\uff0c\u5982\u65b0\u95fb\u3001\u5929\u6c14\u3001\u4f53\u80b2\u6bd4\u5206\u7b49\u3002", "type": "builtin", "return_direct": false, "max_results": 10}, {"name": "python_repl_tool", "description": "\u6267\u884cPython\u4ee3\u7801\u3002\u80fd\u591f\u8fdb\u884c\u8ba1\u7b97\uff0c\u751f\u6210\u56fe\u8868\uff0c\u5904\u7406\u6587\u4ef6\uff0c\u83b7\u53d6\u65e5\u671f\u548c\u65f6\u95f4\u3001\u4ee5\u53ca\u8fdb\u884c\u6570\u636e\u5206\u6790\u3002\u652f\u6301\u591a\u79cd\u5e93\uff0c\u5305\u62ecNumPy\u3001Pandas\u3001Matplotlib\u7b49\u7b49\u5e38\u7528\u5e93\u3002\u9002\u7528\u4e8e\u89e3\u51b3\u6570\u5b66\u95ee\u9898\u3001\u6570\u636e\u5904\u7406\u3001\u53ef\u89c6\u5316\u5c55\u793a\u7b49\u591a\u79cd\u573a\u666f\u3002", "type": "builtin", "return_direct": false, "icon": "PythonReplIcon"}, {"name": "jina_reader_tool", "description": "\u4ece\u7ed9\u5b9a\u7684HTTP/HTTPS\u7f51\u5740\u83b7\u53d6\u7f51\u9875\u7684\u8be6\u7ec6\u5185\u5bb9\u3002 \u6b64\u5de5\u5177\u9002\u7528\u4e8e\u4ece\u7f51\u9875\u4e2d\u63d0\u53d6\u4fe1\u606f\u3002", "type": "builtin", "return_direct": false}], "inputVariables": [{"id": "7kc62z00lwsn4xtq", "name": "question", "value": ""}], "outputVariables": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Zhipu-glm-4-plus-128k", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 676.6666666666666, "y": 232.1111111111112}, "width": 411, "height": 622}], "edges": [{"id": "25551fe28c345288@@25551fe28c345288$$nwj3zxdeyti6dmpm@@7kc62z00lwsn4xtq", "source": "25551fe28c345288", "target": "nwj3zxdeyti6dmpm", "sourceHandle": "25551fe28c345288", "targetHandle": "7kc62z00lwsn4xtq", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-08-19 13:51:50.239989', '2024-09-18 14:24:12.250262');
INSERT INTO "public"."ggl_app" VALUES (45, 4, '新闻智能摘要-基于智能体', 'f', 'http://news.puworld.com/html/20240419/394826838.html 完成摘要', '{"nodes": [{"id": "nb0he5jlwjw7f1b6", "type": "ChatEntryNode", "position": {"x": 257, "y": 256}, "data": {"title": "\u95ee\u9898\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 257, "y": 256}, "width": 220, "height": 55}, {"id": "r4wgeu5y8x71v4ti", "type": "ChatModelNode", "position": {"x": 832, "y": 204}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "You are a helpful assistant.\nProficient in utilizing various tools to assist in resolving user issues.\n\n1.  \u5982\u679c\u9047\u5230\u6458\u8981\u4efb\u52a1\uff0c\u8bf7\u9075\u5faa\u4ee5\u4e0b\u6b65\u9aa4:\n\u6587\u672c\u5185\u5bb9\u8f93\u51fa\u683c\u5f0f\u5fc5\u987b\u662fmarkdown\u683c\u5f0f\u3002\u9996\u5148\u8f93\u51fa\u6587\u7ae0\u7684\u6807\u9898title\uff0c\u5176\u6b21\u5b8c\u6210\u5bf9\u6587\u7ae0\u5185\u5bb9content\u7684\u6458\u8981\uff0c\u6ce8\u610f\u4e0d\u8981\u8f93\u51fa\u6458\u8981\u8fd9\u4e24\u4e2a\u5b57\u3002\n\n\u56fe\u7247\u5c55\u793a\u683c\u5f0f\uff1a<img src=\"xxx img url\" alt=\"xxx alt 3\" /> \n\u89c6\u9891\u5c55\u793a\u683c\u5f0f\uff1a\n<video width=\"640\" height=\"360\" >\n  <source src=\"xxx video url\" type=\"xxx type\">\n</video>\n\n\u6700\u540e\u8f93\u51fa\u6587\u7ae0\u7684\u6765\u6e90url\u3002\n", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "glm-4-flash", "node_carry_history_msg": true, "nodeName": "Chat\u6a21\u578b", "tools_list": [{"name": "jina_reader_tool", "description": "\u6839\u636e\u7528\u6237\u7ed9\u51fa\u7684url(http/https)\u83b7\u53d6\u6b64url\u7684\u7f51\u9875\u5185\u5bb9\u3002", "type": "builtin", "return_direct": false}], "inputVariables": [{"id": "qfc955m8072iegi8", "name": "question", "value": ""}], "outputVariables": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Zhipu-glm-4-flash-128K", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 832, "y": 204}, "width": 411, "height": 622}], "edges": [{"id": "nb0he5jlwjw7f1b6@@nb0he5jlwjw7f1b6$$r4wgeu5y8x71v4ti@@qfc955m8072iegi8", "source": "nb0he5jlwjw7f1b6", "target": "r4wgeu5y8x71v4ti", "sourceHandle": "nb0he5jlwjw7f1b6", "targetHandle": "qfc955m8072iegi8", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-08-16 11:25:13.277523', '2024-09-13 16:54:38.835097');
INSERT INTO "public"."ggl_app" VALUES (43, 4, '百炼公司智能客服-代码调用', 'f', '基于代码调用实现百炼商品知识库检索：介绍手机商品，如游戏手机', '{"nodes": [{"id": "8295ec109d5444a4", "type": "ChatEntryNode", "position": {"x": -124.67444444444445, "y": 207.5511111111111}, "data": {"title": "\u5bf9\u8bdd\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": -124.67444444444445, "y": 207.5511111111111}, "width": 220, "height": 55}, {"id": "6b1ga37s0qchy305", "type": "ChatModelNode", "position": {"x": 1077.7777777777776, "y": 90}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "\u4f60\u662f\u4e00\u4e2a\u767e\u70bc\u516c\u53f8\u5546\u54c1\u7f51\u7ad9\u5e73\u53f0\u7684\u52a9\u624b\u3002\n\n\u4f60\u662f\u5546\u54c1\u68c0\u7d22\u548c\u56de\u7b54\u7684\u5c0f\u80fd\u624b\uff0c\u80fd\u591f\u8010\u5fc3\u4e14\u6e29\u67d4\u5730\u56de\u590d\u7528\u6237\u95ee\u9898\u3002\n\n\u4f60\u7684\u53c2\u8003\u4fe1\u606f\u5982\u4e0b\uff1a\n\n{{reference_information}}\n\n\u8bf7\u56de\u7b54\u7528\u6237\u95ee\u9898\uff1a", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "glm-4-flash", "nodeName": "\u667a\u80fd\u5ba2\u670d", "inputVariables": [{"id": "0cg7sv6l9e3o015s", "name": "question", "value": ""}, {"id": "vd27ixmaxh4t9ip2", "name": "reference_information", "value": ""}], "outputVariables": [], "node_carry_history_msg": true, "tools_list": [], "save_current_conversation": true, "only_carry_human_history_msg": false, "model_label": "Zhipu-glm-4-flash-128K", "use_unified_llm_gateway": true}, "selected": false, "positionAbsolute": {"x": 1077.7777777777776, "y": 90}, "width": 411, "height": 686}, {"id": "obnzdozyh0yitw94", "type": "CodeNode", "position": {"x": 237.55555555555566, "y": 152.6666666666667}, "data": {"title": "Code\u8282\u70b9", "inputVariables": [{"id": "pqrkqv6dsirb716p", "name": "question", "value": ""}], "outputVariables": [{"id": "zvkdw9wy44r73tx5", "name": "reference_information", "value": "data"}], "nodeName": "\u4ee3\u7801\u8c03\u7528\u68c0\u7d22\u767e\u70bc\u77e5\u8bc6\u5e93", "code": "import os\nfrom dotenv import load_dotenv\nfrom alibabacloud_bailian20231229.client import Client as bailian20231229Client\nfrom alibabacloud_tea_openapi import models as open_api_models\nfrom alibabacloud_bailian20231229 import models as bailian_20231229_models\nfrom alibabacloud_tea_util import models as util_models\nfrom alibabacloud_tea_util.client import Client as UtilClient\n\n\nload_dotenv()\n\n\ndef create_client() -> bailian20231229Client:\n    config = open_api_models.Config(\n        access_key_id=os.environ[''ALIBABA_CLOUD_ACCESS_KEY_ID''],\n        access_key_secret=os.environ[''ALIBABA_CLOUD_ACCESS_KEY_SECRET'']\n    )\n    config.endpoint = f''bailian.cn-beijing.aliyuncs.com''\n    return bailian20231229Client(config)\n\n\ndef main(question: str) -> dict:\n    WorkspaceId = ''llm-fmj9nsw50efdmmup''\n    IndexId = ''4djcoo6pit''\n    client = create_client()\n    rerank_0 = bailian_20231229_models.RetrieveRequestRerank(\n        model_name=''gte-rerank-hybrid''\n    )\n    retrieve_request = bailian_20231229_models.RetrieveRequest(\n        query=question,\n        rerank=[\n            rerank_0\n        ],\n        rerank_min_score=0.3,\n        index_id=IndexId,\n        save_retriever_history=False\n    )\n    runtime = util_models.RuntimeOptions()\n    headers = {}\n    try:\n        resp = client.retrieve_with_options(WorkspaceId, retrieve_request, headers, runtime)\n        nodes = resp.body.data.nodes\n        items = []\n        if len(nodes) > 0:\n            for node in nodes:\n                item = {\n                    \"source_doc_name\": node.metadata[''doc_name''],\n                    \"content\": node.text,\n                    \"score\": node.score\n                }\n                items.append(item)\n        return {\n            \"status\": 200,\n            \"message\": \"\u6210\u529f\",\n            \"data\": items\n        }\n    except Exception as error:\n        print(error.message)\n        print(error.data.get(\"Recommend\"))\n        UtilClient.assert_as_string(error.message)\n\n# main(\"\u6e38\u620f\u624b\u673a\")\nmain(question)\n\n", "isLocalExecution": false}, "selected": true, "positionAbsolute": {"x": 237.55555555555566, "y": 152.6666666666667}, "width": 390, "height": 393}, {"id": "m3jt98ic1kj6jevl", "type": "ChatEntryNode", "position": {"x": 710, "y": 96}, "data": {"title": "\u95ee\u9898\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": 710, "y": 96}, "width": 220, "height": 55}], "edges": [{"id": "8295ec109d5444a4@@8295ec109d5444a4$$obnzdozyh0yitw94@@pqrkqv6dsirb716p", "source": "8295ec109d5444a4", "target": "obnzdozyh0yitw94", "sourceHandle": "8295ec109d5444a4", "targetHandle": "pqrkqv6dsirb716p", "type": "ErasableEdge", "selected": false}, {"id": "m3jt98ic1kj6jevl@@m3jt98ic1kj6jevl$$6b1ga37s0qchy305@@0cg7sv6l9e3o015s", "source": "m3jt98ic1kj6jevl", "target": "6b1ga37s0qchy305", "sourceHandle": "m3jt98ic1kj6jevl", "targetHandle": "0cg7sv6l9e3o015s", "type": "ErasableEdge", "selected": false}, {"id": "obnzdozyh0yitw94@@zvkdw9wy44r73tx5$$6b1ga37s0qchy305@@vd27ixmaxh4t9ip2", "source": "obnzdozyh0yitw94", "target": "6b1ga37s0qchy305", "sourceHandle": "zvkdw9wy44r73tx5", "targetHandle": "vd27ixmaxh4t9ip2", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 0, "y": 0, "zoom": 0.9}}', 1, '2024-08-19 10:01:21.596273', '2024-09-18 13:50:38.770057');
INSERT INTO "public"."ggl_app" VALUES (41, 4, '问题分类-分支判断', 'f', '根据用户问题使用大模型进行问题分类，之后根据大模型分类结果 动态路由到不同角色的大模型来回答问题', '{"nodes": [{"id": "f3ractbsh7iq4rdc", "type": "ChatEntryNode", "position": {"x": -128.77777777777774, "y": -263.00000000000006}, "data": {"title": "\u95ee\u9898\u5165\u53e3"}, "selected": false, "positionAbsolute": {"x": -128.77777777777774, "y": -263.00000000000006}, "width": 220, "height": 55}, {"id": "qbm3e8uh9ei2rl93", "type": "ChatModelNode", "position": {"x": 344.111111111111, "y": -260.44444444444446}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "Given the user question below, classify it as either being about `Math`, `Physics`, or `Other`.\n\nAnswer in JSON format, for example: \nexample-1\uff1a\n```json\n{\n\"classify\":\"Math\",\n\"question\":\"user question\"\n}\n```\nexample-2\uff1a\n```json\n{\n\"classify\":\"Physics\",\n\"question\":\"user question\"\n}\n```\nexample-3\uff1a\n```json\n{\n\"classify\":\"Other\",\n\"question\":\"user question\"\n}\n```\n\nUser Question: {{question}}\n\nYour Answer:", "max_tokens": 4096, "temperature": 0.4, "top_p": 0.7, "model_name": "glm-4-airx", "nodeName": "\u95ee\u9898\u5206\u7c7b\u5927\u6a21\u578b\u8282\u70b9", "inputVariables": [{"id": "t7wpdd06lu1an61e", "name": "question", "value": ""}], "outputVariables": [{"id": "9939dalc4ox77uyf", "name": "classify", "value": "classify"}, {"id": "y9qfw73n49vq46lc", "name": "question", "value": "question"}], "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": false, "model_label": "Zhipu-glm-4-airx-8K", "use_unified_llm_gateway": true}, "selected": true, "positionAbsolute": {"x": 344.111111111111, "y": -260.44444444444446}, "width": 412, "height": 742}, {"id": "r0bu3ncrplu1nbvk", "type": "BranchNode", "position": {"x": 1017.6265306153239, "y": -75.9936525518718}, "data": {"title": "\u6761\u4ef6\u8282\u70b9", "outputVariables": [], "nodeName": "\u5206\u652f\u5224\u65ad\u8282\u70b9", "conditions": [{"id": "8tisva16hgaxukr3", "target_node": "", "variables": [{"varName": "classify", "operator": "contains", "value": "Math"}]}, {"id": "d207i1w1axsdhntd", "variables": [{"varName": "classify", "operator": "contains", "value": "Physics"}], "target_node": ""}, {"id": "yer8s8yff2m4ljzp", "variables": [{"varName": "classify", "operator": "contains", "value": "Other"}], "target_node": ""}]}, "selected": false, "positionAbsolute": {"x": 1017.6265306153239, "y": -75.9936525518718}, "width": 580, "height": 563}, {"id": "vubtb0v6mysccu2m", "type": "ChatModelNode", "position": {"x": 1846.2076913068827, "y": 209.10513886621183}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "You are a friendly conversational companion, patient and amiable.\nYour name is Ode.", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "THUDM/glm-4-9b-chat", "nodeName": "\u5176\u4ed6-\u4e13\u5bb6", "inputVariables": [], "outputVariables": [], "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": true, "model_label": "Siliconflow-glm-4-9b-chat-32k", "use_unified_llm_gateway": true}, "selected": false, "positionAbsolute": {"x": 1846.2076913068827, "y": 209.10513886621183}, "width": 412, "height": 566}, {"id": "lu9oq3w2fpcss6ln", "type": "ChatModelNode", "position": {"x": 1827.2031075295995, "y": -949.3703669526783}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "You are an expert in math. Your name is Mack.", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "deepseek-ai/DeepSeek-V2-Chat", "nodeName": "\u6570\u5b66\u4e13\u5bb6", "inputVariables": [], "outputVariables": [], "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": true, "model_label": "Siliconflow-DeepSeek-V2-Chat", "use_unified_llm_gateway": false}, "selected": false, "positionAbsolute": {"x": 1827.2031075295995, "y": -949.3703669526783}, "width": 412, "height": 566}, {"id": "vup84rqjk7kld80f", "type": "ChatModelNode", "position": {"x": 1844.61206909569, "y": -365.77719404647723}, "data": {"title": "Chat\u6a21\u578b", "message_count": 5, "prompt": "You are an expert in physics. Your name is Philip.", "max_tokens": 4096, "temperature": 0.9, "top_p": 0.7, "model_name": "deepseek-ai/DeepSeek-V2-Chat", "nodeName": "\u7269\u7406\u5b66\u4e13\u5bb6", "inputVariables": [], "outputVariables": [], "node_carry_history_msg": false, "tools_list": [], "only_carry_human_history_msg": false, "save_current_conversation": true, "model_label": "Siliconflow-DeepSeek-V2-Chat", "use_unified_llm_gateway": false}, "selected": false, "positionAbsolute": {"x": 1844.61206909569, "y": -365.77719404647723}, "width": 412, "height": 566}], "edges": [{"id": "f3ractbsh7iq4rdc@@f3ractbsh7iq4rdc$$qbm3e8uh9ei2rl93@@t7wpdd06lu1an61e", "source": "f3ractbsh7iq4rdc", "target": "qbm3e8uh9ei2rl93", "sourceHandle": "f3ractbsh7iq4rdc", "targetHandle": "t7wpdd06lu1an61e", "type": "ErasableEdge", "selected": false}, {"id": "qbm3e8uh9ei2rl93@@9939dalc4ox77uyf$$r0bu3ncrplu1nbvk@@r0bu3ncrplu1nbvk", "source": "qbm3e8uh9ei2rl93", "target": "r0bu3ncrplu1nbvk", "sourceHandle": "9939dalc4ox77uyf", "targetHandle": "r0bu3ncrplu1nbvk", "type": "ErasableEdge", "selected": false}, {"id": "r0bu3ncrplu1nbvk@@yer8s8yff2m4ljzp$$vubtb0v6mysccu2m@@vubtb0v6mysccu2m", "source": "r0bu3ncrplu1nbvk", "target": "vubtb0v6mysccu2m", "sourceHandle": "yer8s8yff2m4ljzp", "targetHandle": "vubtb0v6mysccu2m", "type": "ErasableEdge", "selected": false}, {"id": "r0bu3ncrplu1nbvk@@d207i1w1axsdhntd$$vup84rqjk7kld80f@@vup84rqjk7kld80f", "source": "r0bu3ncrplu1nbvk", "target": "vup84rqjk7kld80f", "sourceHandle": "d207i1w1axsdhntd", "targetHandle": "vup84rqjk7kld80f", "type": "ErasableEdge", "selected": false}, {"id": "r0bu3ncrplu1nbvk@@8tisva16hgaxukr3$$lu9oq3w2fpcss6ln@@lu9oq3w2fpcss6ln", "source": "r0bu3ncrplu1nbvk", "target": "lu9oq3w2fpcss6ln", "sourceHandle": "8tisva16hgaxukr3", "targetHandle": "lu9oq3w2fpcss6ln", "type": "ErasableEdge", "selected": false}], "viewport": {"x": 219, "y": 416, "zoom": 0.9}}', 1, '2024-07-24 08:54:55.8595', '2024-09-18 11:46:15.953384');

-- ----------------------------
-- Table structure for ggl_app_dept
-- ----------------------------
CREATE TABLE "public"."ggl_app_dept" (
                                         "id" int4 NOT NULL DEFAULT nextval('ggl_app_dept_id_seq'::regclass),
                                         "app_id" int4 NOT NULL,
                                         "dept_id" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."ggl_app_dept"."id" IS '主键ID';
COMMENT ON COLUMN "public"."ggl_app_dept"."app_id" IS '应用ID';
COMMENT ON COLUMN "public"."ggl_app_dept"."dept_id" IS '部门ID';

-- ----------------------------
-- Table structure for ggl_chat_history
-- ----------------------------
CREATE TABLE "public"."ggl_chat_history" (
                                             "id" int4 NOT NULL DEFAULT nextval('ggl_chat_history_id_seq'::regclass),
                                             "session_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                             "app_id" int4 NOT NULL,
                                             "user_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                             "message" jsonb NOT NULL,
                                             "created_time" timestamp(6) NOT NULL,
                                             "updated_time" timestamp(6)
)
;

-- ----------------------------
-- Table structure for ggl_chat_session
-- ----------------------------
CREATE TABLE "public"."ggl_chat_session" (
                                             "id" int4 NOT NULL DEFAULT nextval('ggl_chat_session_id_seq'::regclass),
                                             "session_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                             "app_id" int4 NOT NULL,
                                             "user_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                             "session_name" varchar(200) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
                                             "del_flag" bool NOT NULL DEFAULT false,
                                             "created_time" timestamp(6) NOT NULL,
                                             "updated_time" timestamp(6)
)
;

-- ----------------------------
-- Table structure for ggl_dir
-- ----------------------------
CREATE TABLE "public"."ggl_dir" (
                                    "id" int4 NOT NULL DEFAULT nextval('ggl_dir_id_seq'::regclass),
                                    "uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                    "owner_id" int4,
                                    "del_flag" bool NOT NULL,
                                    "name" varchar(25) COLLATE "pg_catalog"."default" NOT NULL,
                                    "desc" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "parent_id" int4,
                                    "created_time" timestamp(6) NOT NULL,
                                    "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."ggl_dir"."id" IS '主键id';
COMMENT ON COLUMN "public"."ggl_dir"."owner_id" IS '拥有者关联ID';
COMMENT ON COLUMN "public"."ggl_dir"."del_flag" IS '删除标志';
COMMENT ON COLUMN "public"."ggl_dir"."name" IS '目录名称';
COMMENT ON COLUMN "public"."ggl_dir"."desc" IS '目录描述';
COMMENT ON COLUMN "public"."ggl_dir"."parent_id" IS '父目录ID';
COMMENT ON COLUMN "public"."ggl_dir"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."ggl_dir"."updated_time" IS '更新时间';

-- ----------------------------
-- Table structure for ggl_dir_dept
-- ----------------------------
CREATE TABLE "public"."ggl_dir_dept" (
                                         "id" int4 NOT NULL DEFAULT nextval('ggl_dir_dept_id_seq'::regclass),
                                         "dir_id" int4 NOT NULL,
                                         "dept_id" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."ggl_dir_dept"."id" IS '主键ID';
COMMENT ON COLUMN "public"."ggl_dir_dept"."dir_id" IS '目录ID';
COMMENT ON COLUMN "public"."ggl_dir_dept"."dept_id" IS '部门ID';


-- ----------------------------
-- Table structure for ggl_doc
-- ----------------------------
CREATE TABLE "public"."ggl_doc" (
                                    "id" int4 NOT NULL DEFAULT nextval('ggl_doc_id_seq'::regclass),
                                    "uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                    "dir_id" int4 NOT NULL,
                                    "del_flag" bool NOT NULL,
                                    "name" varchar(25) COLLATE "pg_catalog"."default" NOT NULL,
                                    "content" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "source" varchar(25) COLLATE "pg_catalog"."default" NOT NULL,
                                    "source_desc" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "source_type" varchar(25) COLLATE "pg_catalog"."default" NOT NULL,
                                    "path" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "url" text COLLATE "pg_catalog"."default" NOT NULL,
                                    "file_size" int8 NOT NULL,
                                    "word_count" int8 NOT NULL,
                                    "split_config" json NOT NULL,
                                    "meta_info" json NOT NULL,
                                    "created_time" timestamp(6) NOT NULL,
                                    "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."ggl_doc"."id" IS '主键id';
COMMENT ON COLUMN "public"."ggl_doc"."del_flag" IS '删除标志';
COMMENT ON COLUMN "public"."ggl_doc"."name" IS '文档名称';
COMMENT ON COLUMN "public"."ggl_doc"."content" IS '内容';
COMMENT ON COLUMN "public"."ggl_doc"."source" IS '来源';
COMMENT ON COLUMN "public"."ggl_doc"."source_desc" IS '来源描述';
COMMENT ON COLUMN "public"."ggl_doc"."source_type" IS '来源类型';
COMMENT ON COLUMN "public"."ggl_doc"."path" IS '文档路径：oss';
COMMENT ON COLUMN "public"."ggl_doc"."url" IS '文档网络地址';
COMMENT ON COLUMN "public"."ggl_doc"."file_size" IS '文件大小';
COMMENT ON COLUMN "public"."ggl_doc"."word_count" IS '字数';
COMMENT ON COLUMN "public"."ggl_doc"."split_config" IS '分割配置';
COMMENT ON COLUMN "public"."ggl_doc"."meta_info" IS '文档元数据';
COMMENT ON COLUMN "public"."ggl_doc"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."ggl_doc"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of ggl_doc
-- ----------------------------

-- ----------------------------
-- Table structure for ggl_doc_chunk
-- ----------------------------
CREATE TABLE "public"."ggl_doc_chunk" (
                                          "id" int4 NOT NULL DEFAULT nextval('ggl_doc_chunk_id_seq'::regclass),
                                          "uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                          "doc_id" int4 NOT NULL,
                                          "del_flag" bool NOT NULL,
                                          "meta_info" json NOT NULL,
                                          "content" text COLLATE "pg_catalog"."default" NOT NULL,
                                          "content_type" varchar(25) COLLATE "pg_catalog"."default" NOT NULL,
                                          "embedding" "public"."vector" NOT NULL,
                                          "created_time" timestamp(6) NOT NULL,
                                          "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."ggl_doc_chunk"."id" IS '主键id';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."del_flag" IS '删除标志（0删除 1存在）';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."meta_info" IS '块元数据';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."content" IS '块内容';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."content_type" IS '块类型';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."embedding" IS '嵌入向量';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."ggl_doc_chunk"."updated_time" IS '更新时间';

-- ----------------------------
-- Table structure for sys_api
-- ----------------------------
CREATE TABLE "public"."sys_api" (
                                    "id" int4 NOT NULL DEFAULT nextval('sys_api_id_seq'::regclass),
                                    "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                    "method" varchar(16) COLLATE "pg_catalog"."default" NOT NULL,
                                    "path" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
                                    "remark" text COLLATE "pg_catalog"."default",
                                    "created_time" timestamp(6) NOT NULL,
                                    "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_api"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_api"."name" IS 'api名称';
COMMENT ON COLUMN "public"."sys_api"."method" IS '请求方法';
COMMENT ON COLUMN "public"."sys_api"."path" IS 'api路径';
COMMENT ON COLUMN "public"."sys_api"."remark" IS '备注';
COMMENT ON COLUMN "public"."sys_api"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_api"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of sys_api
-- ----------------------------

-- ----------------------------
-- Table structure for sys_casbin_rule
-- ----------------------------
CREATE TABLE "public"."sys_casbin_rule" (
                                            "id" int4 NOT NULL DEFAULT nextval('sys_casbin_rule_id_seq'::regclass),
                                            "ptype" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
                                            "v0" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
                                            "v1" text COLLATE "pg_catalog"."default" NOT NULL,
                                            "v2" varchar(255) COLLATE "pg_catalog"."default",
                                            "v3" varchar(255) COLLATE "pg_catalog"."default",
                                            "v4" varchar(255) COLLATE "pg_catalog"."default",
                                            "v5" varchar(255) COLLATE "pg_catalog"."default"
)
;
COMMENT ON COLUMN "public"."sys_casbin_rule"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_casbin_rule"."ptype" IS '策略类型: p / g';
COMMENT ON COLUMN "public"."sys_casbin_rule"."v0" IS '角色ID / 用户uuid';
COMMENT ON COLUMN "public"."sys_casbin_rule"."v1" IS 'api路径 / 角色名称';
COMMENT ON COLUMN "public"."sys_casbin_rule"."v2" IS '请求方法';

-- ----------------------------
-- Records of sys_casbin_rule
-- ----------------------------
INSERT INTO "public"."sys_casbin_rule" VALUES (1, 'g', 'efa40974-e346-42f7-a9c0-a1a767ed2ed5', '2', NULL, NULL, NULL, NULL);
INSERT INTO "public"."sys_casbin_rule" VALUES (2, 'g', 'e814de92-d03d-4007-b0a9-04a8fa8b0df4', '1', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
CREATE TABLE "public"."sys_dept" (
                                     "id" int4 NOT NULL DEFAULT nextval('sys_dept_id_seq'::regclass),
                                     "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                     "level" int4 NOT NULL,
                                     "sort" int4 NOT NULL,
                                     "leader" varchar(20) COLLATE "pg_catalog"."default",
                                     "phone" varchar(25) COLLATE "pg_catalog"."default",
                                     "email" varchar(50) COLLATE "pg_catalog"."default",
                                     "status" int4 NOT NULL,
                                     "del_flag" bool NOT NULL,
                                     "parent_id" int4,
                                     "created_time" timestamp(6) NOT NULL,
                                     "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_dept"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_dept"."name" IS '部门名称';
COMMENT ON COLUMN "public"."sys_dept"."level" IS '部门层级';
COMMENT ON COLUMN "public"."sys_dept"."sort" IS '排序';
COMMENT ON COLUMN "public"."sys_dept"."leader" IS '负责人';
COMMENT ON COLUMN "public"."sys_dept"."phone" IS '手机';
COMMENT ON COLUMN "public"."sys_dept"."email" IS '邮箱';
COMMENT ON COLUMN "public"."sys_dept"."status" IS '部门状态(0停用 1正常)';
COMMENT ON COLUMN "public"."sys_dept"."del_flag" IS '删除标志（0删除 1存在）';
COMMENT ON COLUMN "public"."sys_dept"."parent_id" IS '父部门ID';
COMMENT ON COLUMN "public"."sys_dept"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_dept"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO "public"."sys_dept" VALUES (1, '数据部', 0, 0, 'tst', 'tel:+86-139-8225-0859', 'anthov@outlook.com', 1, 'f', 3, '2024-03-18 11:04:02.153636', '2024-03-27 14:06:17.497957');
INSERT INTO "public"."sys_dept" VALUES (2, '运营中心', 0, 1, '杰克', 'tel:+86-132-6608-7621', '10110944@qq.com', 1, 'f', NULL, '2024-03-27 11:40:32.806046', '2024-03-27 15:26:16.989335');
INSERT INTO "public"."sys_dept" VALUES (3, '研发中心', 0, 2, 'likai', 'tel:+86-132-8225-0851', 'tuenxx@gmail.com', 1, 'f', NULL, '2024-03-27 13:06:07.760044', '2024-03-27 15:27:59.080797');
INSERT INTO "public"."sys_dept" VALUES (5, '销售部', 0, 0, '张先生', 'tel:+86-130-1212-2622', '11xxx@qq.com', 1, 't', 2, '2024-03-27 16:14:17.779709', '2024-03-27 16:17:53.16043');
INSERT INTO "public"."sys_dept" VALUES (4, '产品部', 0, 0, 'ss', 'tel:+86-135-6698-7889', '194@qq.com', 1, 'f', 3, '2024-03-27 13:06:39.964854', '2024-04-08 16:07:01.052707');
INSERT INTO "public"."sys_dept" VALUES (6, '技术部', 0, 0, 'jack', 'tel:+86-132-8225-8888', NULL, 1, 'f', 3, '2024-03-28 10:42:15.5397', '2024-06-25 08:51:33.515864');

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
CREATE TABLE "public"."sys_dict_data" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_dict_data_id_seq'::regclass),
                                          "label" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
                                          "value" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
                                          "sort" int4 NOT NULL,
                                          "status" int4 NOT NULL,
                                          "remark" text COLLATE "pg_catalog"."default",
                                          "type_id" int4 NOT NULL,
                                          "created_time" timestamp(6) NOT NULL,
                                          "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_dict_data"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_dict_data"."label" IS '字典标签';
COMMENT ON COLUMN "public"."sys_dict_data"."value" IS '字典值';
COMMENT ON COLUMN "public"."sys_dict_data"."sort" IS '排序';
COMMENT ON COLUMN "public"."sys_dict_data"."status" IS '状态（0停用 1正常）';
COMMENT ON COLUMN "public"."sys_dict_data"."remark" IS '备注';
COMMENT ON COLUMN "public"."sys_dict_data"."type_id" IS '字典类型关联ID';
COMMENT ON COLUMN "public"."sys_dict_data"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_dict_data"."updated_time" IS '更新时间';

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
CREATE TABLE "public"."sys_dict_type" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_dict_type_id_seq'::regclass),
                                          "name" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
                                          "code" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
                                          "status" int4 NOT NULL,
                                          "remark" text COLLATE "pg_catalog"."default",
                                          "created_time" timestamp(6) NOT NULL,
                                          "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_dict_type"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_dict_type"."name" IS '字典类型名称';
COMMENT ON COLUMN "public"."sys_dict_type"."code" IS '字典类型编码';
COMMENT ON COLUMN "public"."sys_dict_type"."status" IS '状态（0停用 1正常）';
COMMENT ON COLUMN "public"."sys_dict_type"."remark" IS '备注';
COMMENT ON COLUMN "public"."sys_dict_type"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_dict_type"."updated_time" IS '更新时间';


-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
CREATE TABLE "public"."sys_login_log" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_login_log_id_seq'::regclass),
                                          "user_uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                          "username" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                          "status" int4 NOT NULL,
                                          "ip" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                          "country" varchar(50) COLLATE "pg_catalog"."default",
                                          "region" varchar(50) COLLATE "pg_catalog"."default",
                                          "city" varchar(50) COLLATE "pg_catalog"."default",
                                          "user_agent" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
                                          "os" varchar(50) COLLATE "pg_catalog"."default",
                                          "browser" varchar(50) COLLATE "pg_catalog"."default",
                                          "device" varchar(50) COLLATE "pg_catalog"."default",
                                          "msg" text COLLATE "pg_catalog"."default" NOT NULL,
                                          "login_time" timestamp(6) NOT NULL,
                                          "created_time" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."sys_login_log"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_login_log"."user_uuid" IS '用户UUID';
COMMENT ON COLUMN "public"."sys_login_log"."username" IS '用户名';
COMMENT ON COLUMN "public"."sys_login_log"."status" IS '登录状态(0失败 1成功)';
COMMENT ON COLUMN "public"."sys_login_log"."ip" IS '登录IP地址';
COMMENT ON COLUMN "public"."sys_login_log"."country" IS '国家';
COMMENT ON COLUMN "public"."sys_login_log"."region" IS '地区';
COMMENT ON COLUMN "public"."sys_login_log"."city" IS '城市';
COMMENT ON COLUMN "public"."sys_login_log"."user_agent" IS '请求头';
COMMENT ON COLUMN "public"."sys_login_log"."os" IS '操作系统';
COMMENT ON COLUMN "public"."sys_login_log"."browser" IS '浏览器';
COMMENT ON COLUMN "public"."sys_login_log"."device" IS '设备';
COMMENT ON COLUMN "public"."sys_login_log"."msg" IS '提示消息';
COMMENT ON COLUMN "public"."sys_login_log"."login_time" IS '登录时间';
COMMENT ON COLUMN "public"."sys_login_log"."created_time" IS '创建时间';

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
CREATE TABLE "public"."sys_menu" (
                                     "id" int4 NOT NULL DEFAULT nextval('sys_menu_id_seq'::regclass),
                                     "title" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                     "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                     "level" int4 NOT NULL,
                                     "sort" int4 NOT NULL,
                                     "icon" varchar(100) COLLATE "pg_catalog"."default",
                                     "path" varchar(200) COLLATE "pg_catalog"."default",
                                     "menu_type" int4 NOT NULL,
                                     "component" varchar(255) COLLATE "pg_catalog"."default",
                                     "perms" varchar(100) COLLATE "pg_catalog"."default",
                                     "status" int4 NOT NULL,
                                     "show" int4 NOT NULL,
                                     "cache" int4 NOT NULL,
                                     "remark" text COLLATE "pg_catalog"."default",
                                     "parent_id" int4,
                                     "created_time" timestamp(6) NOT NULL,
                                     "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_menu"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_menu"."title" IS '菜单标题';
COMMENT ON COLUMN "public"."sys_menu"."name" IS '菜单名称';
COMMENT ON COLUMN "public"."sys_menu"."level" IS '菜单层级';
COMMENT ON COLUMN "public"."sys_menu"."sort" IS '排序';
COMMENT ON COLUMN "public"."sys_menu"."icon" IS '菜单图标';
COMMENT ON COLUMN "public"."sys_menu"."path" IS '路由地址';
COMMENT ON COLUMN "public"."sys_menu"."menu_type" IS '菜单类型（0目录 1菜单 2按钮）';
COMMENT ON COLUMN "public"."sys_menu"."component" IS '组件路径';
COMMENT ON COLUMN "public"."sys_menu"."perms" IS '权限标识';
COMMENT ON COLUMN "public"."sys_menu"."status" IS '菜单状态（0停用 1正常）';
COMMENT ON COLUMN "public"."sys_menu"."show" IS '是否显示（0否 1是）';
COMMENT ON COLUMN "public"."sys_menu"."cache" IS '是否缓存（0否 1是）';
COMMENT ON COLUMN "public"."sys_menu"."remark" IS '备注';
COMMENT ON COLUMN "public"."sys_menu"."parent_id" IS '父菜单ID';
COMMENT ON COLUMN "public"."sys_menu"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_menu"."updated_time" IS '更新时间';


-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO "public"."sys_menu" VALUES (2, '仪表盘', 'dashboard', 0, 0, 'IconDashboard', 'dashboard', 0, NULL, NULL, 1, 1, 1, NULL, NULL, '2023-07-27 19:15:45', NULL);
INSERT INTO "public"."sys_menu" VALUES (12, '编辑', '', 0, 0, NULL, NULL, 2, NULL, 'sys:dept:edit', 1, 1, 1, NULL, 10, '2024-01-07 11:37:29', NULL);
INSERT INTO "public"."sys_menu" VALUES (13, '删除', '', 0, 0, NULL, NULL, 2, NULL, 'sys:dept:del', 1, 1, 1, NULL, 10, '2024-01-07 11:37:44', NULL);
INSERT INTO "public"."sys_menu" VALUES (15, '新增', '', 0, 0, NULL, NULL, 2, NULL, 'sys:api:add', 1, 1, 1, NULL, 14, '2024-01-07 11:57:09', NULL);
INSERT INTO "public"."sys_menu" VALUES (16, '编辑', '', 0, 0, NULL, NULL, 2, NULL, 'sys:api:edit', 1, 1, 1, NULL, 14, '2024-01-07 11:57:44', NULL);
INSERT INTO "public"."sys_menu" VALUES (17, '删除', '', 0, 0, NULL, NULL, 2, NULL, 'sys:api:del', 1, 1, 1, NULL, 14, '2024-01-07 11:57:56', NULL);
INSERT INTO "public"."sys_menu" VALUES (19, '编辑用户角色', '', 0, 0, NULL, NULL, 2, NULL, 'sys:user:role:edit', 1, 1, 1, NULL, 18, '2024-01-07 12:04:20', NULL);
INSERT INTO "public"."sys_menu" VALUES (20, '注销', '', 0, 0, NULL, NULL, 2, NULL, 'sys:user:del', 1, 1, 1, '用户注销 != 用户登出，注销之后用户将从数据库删除', 18, '2024-01-07 02:28:09', NULL);
INSERT INTO "public"."sys_menu" VALUES (22, '新增', '', 0, 0, NULL, NULL, 2, NULL, 'sys:role:add', 1, 1, 1, NULL, 21, '2024-01-07 11:58:37', NULL);
INSERT INTO "public"."sys_menu" VALUES (23, '编辑', '', 0, 0, NULL, NULL, 2, NULL, 'sys:role:edit', 1, 1, 1, NULL, 21, '2024-01-07 11:58:52', NULL);
INSERT INTO "public"."sys_menu" VALUES (24, '删除', '', 0, 0, NULL, NULL, 2, NULL, 'sys:role:del', 1, 1, 1, NULL, 21, '2024-01-07 11:59:07', NULL);
INSERT INTO "public"."sys_menu" VALUES (25, '编辑角色菜单', '', 0, 0, NULL, NULL, 2, NULL, 'sys:role:menu:edit', 1, 1, 1, NULL, 21, '2024-01-07 01:59:39', NULL);
INSERT INTO "public"."sys_menu" VALUES (27, '新增', '', 0, 0, NULL, NULL, 2, NULL, 'sys:menu:add', 1, 1, 1, NULL, 26, '2024-01-07 12:01:24', NULL);
INSERT INTO "public"."sys_menu" VALUES (28, '编辑', '', 0, 0, NULL, NULL, 2, NULL, 'sys:menu:edit', 1, 1, 1, NULL, 26, '2024-01-07 12:01:34', NULL);
INSERT INTO "public"."sys_menu" VALUES (29, '删除', '', 0, 0, NULL, NULL, 2, NULL, 'sys:menu:del', 1, 1, 1, NULL, 26, '2024-01-07 12:01:48', NULL);
INSERT INTO "public"."sys_menu" VALUES (30, '系统监控', 'monitor', 0, 88, 'IconComputer', 'monitor', 0, NULL, NULL, 1, 1, 1, NULL, NULL, '2023-07-27 19:27:08', NULL);
INSERT INTO "public"."sys_menu" VALUES (9, '系统管理', 'sys', 0, 6, 'IconSettings', 'sys', 0, NULL, NULL, 1, 1, 1, NULL, NULL, '2023-07-27 19:23:00', '2024-03-22 08:12:43.815385');
INSERT INTO "public"."sys_menu" VALUES (33, '应用中心', 'AppCenter', 0, 0, NULL, 'app-center', 1, '/Ggl/AppCenter', 'app:center', 1, 1, 1, NULL, 4, '2024-04-07 10:29:06.040705', NULL);
INSERT INTO "public"."sys_menu" VALUES (4, 'LLM应用', 'app', 0, 0, NULL, 'app', 0, NULL, NULL, 1, 1, 1, NULL, NULL, '2024-04-07 10:04:16.670843', '2024-04-07 10:32:35.17358');
INSERT INTO "public"."sys_menu" VALUES (34, '应用流程编排', 'AppFlow', 0, 0, NULL, 'app-flow', 1, '/Ggl/AppFlow', 'app:flow', 1, 1, 1, NULL, 4, '2024-04-09 22:04:07.175171', NULL);
INSERT INTO "public"."sys_menu" VALUES (35, '数据集', 'DataSet', 0, 0, NULL, 'app-dataset', 1, '/Ggl/DataSet', 'app:dataset', 1, 1, 1, NULL, 4, '2024-04-30 10:43:51.090053', NULL);
INSERT INTO "public"."sys_menu" VALUES (36, '应用Chat', 'AppChat', 0, 0, NULL, 'app-chat', 1, '/Ggl/Chat', 'app:chat', 1, 1, 1, NULL, 4, '2024-07-29 11:40:49.010784', NULL);
INSERT INTO "public"."sys_menu" VALUES (10, '部门管理', 'SysDept', 0, 0, NULL, 'sys-dept', 1, '/admin/dept/index', 'sys:dept', 1, 1, 1, NULL, 9, '2023-07-27 19:23:42', '2024-09-10 11:28:08.044829');
INSERT INTO "public"."sys_menu" VALUES (31, 'Redis监控', 'Redis', 0, 0, NULL, 'redis', 1, '/monitor/redis/index', 'sys:monitor:redis', 1, 1, 1, NULL, 30, '2023-07-27 19:28:03', '2024-09-10 13:10:01.298416');
INSERT INTO "public"."sys_menu" VALUES (32, '服务器监控', 'Server', 0, 0, NULL, 'server', 1, '/monitor/server/index', 'sys:monitor:server', 1, 1, 1, NULL, 30, '2023-07-27 19:28:29', '2024-09-10 13:10:11.61755');
INSERT INTO "public"."sys_menu" VALUES (6, '登录日志', 'Login', 0, 0, NULL, 'login', 1, '/log/login/index', 'log:login', 1, 1, 1, NULL, 5, '2023-07-27 19:20:56', '2024-09-10 13:10:33.957878');
INSERT INTO "public"."sys_menu" VALUES (21, '角色管理', 'SysRole', 0, 2, NULL, 'sys-role', 1, '/admin/role/index', 'sys:role', 1, 1, 1, NULL, 9, '2023-07-27 19:25:45', '2024-09-10 13:11:18.181229');
INSERT INTO "public"."sys_menu" VALUES (14, 'API管理', 'SysApi', 0, 1, NULL, 'sys-api', 1, '/admin/api/index', 'sys:api', 1, 1, 1, NULL, 9, '2023-07-27 19:24:12', '2024-09-10 13:11:25.770718');
INSERT INTO "public"."sys_menu" VALUES (18, '用户管理', 'SysUser', 0, 0, NULL, 'sys-user', 1, '/admin/user/index', 'sys:user', 1, 1, 1, NULL, 9, '2023-07-27 19:25:13', '2024-09-10 13:11:37.89007');
INSERT INTO "public"."sys_menu" VALUES (3, '工作台', 'Workplace', 0, 0, NULL, 'workplace', 1, '/dashboard/workplace/index', 'dashboard:workplace', 1, 1, 1, NULL, 2, '2023-07-27 19:17:59', '2024-09-10 13:11:56.457439');
INSERT INTO "public"."sys_menu" VALUES (40, '操作日志清空', '', 0, 0, NULL, 'opera', 2, '', 'log:opera:empty', 1, 1, 1, NULL, 37, '2024-09-10 14:33:38.878935', NULL);
INSERT INTO "public"."sys_menu" VALUES (26, '菜单管理', 'SysMenu', 0, 2, NULL, 'sys-menu', 1, '/admin/menu/index', 'sys:menu', 1, 1, 1, NULL, 9, '2023-07-27 19:45:29', '2024-09-10 14:33:53.716892');
INSERT INTO "public"."sys_menu" VALUES (41, '操作日志删除', '-', 0, 0, NULL, 'opera', 2, NULL, 'log:opera:del', 1, 1, 1, NULL, 37, '2024-09-10 14:38:09.437369', '2024-09-10 14:38:31.184032');
INSERT INTO "public"."sys_menu" VALUES (44, '部门新增', '部门新增', 0, 0, NULL, 'dept', 2, NULL, 'sys:dept:add', 1, 1, 1, NULL, 10, '2024-09-10 14:53:03.867393', '2024-09-10 15:08:50.384237');
INSERT INTO "public"."sys_menu" VALUES (5, '日志管理', 'log', 0, 66, 'IconBug', 'log', 0, NULL, '', 1, 1, 1, NULL, NULL, '2023-07-27 19:19:59', '2024-09-12 14:42:59.352806');
INSERT INTO "public"."sys_menu" VALUES (37, '操作日志', 'Opera', 0, 0, NULL, 'log-opera', 1, '/Log/Opera', 'log:opera', 1, 1, 1, NULL, 5, '2024-09-10 14:04:57.471639', '2024-09-12 14:41:41.609121');
-- ----------------------------
-- Table structure for sys_opera_log
-- ----------------------------
CREATE TABLE "public"."sys_opera_log" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_opera_log_id_seq'::regclass),
                                          "username" varchar(20) COLLATE "pg_catalog"."default",
                                          "method" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                          "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
                                          "path" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
                                          "ip" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                          "country" varchar(50) COLLATE "pg_catalog"."default",
                                          "region" varchar(50) COLLATE "pg_catalog"."default",
                                          "city" varchar(50) COLLATE "pg_catalog"."default",
                                          "user_agent" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
                                          "os" varchar(50) COLLATE "pg_catalog"."default",
                                          "browser" varchar(50) COLLATE "pg_catalog"."default",
                                          "device" varchar(50) COLLATE "pg_catalog"."default",
                                          "args" json,
                                          "status" int4 NOT NULL,
                                          "code" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                          "msg" text COLLATE "pg_catalog"."default",
                                          "cost_time" float8 NOT NULL,
                                          "opera_time" timestamp(6) NOT NULL,
                                          "created_time" timestamp(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."sys_opera_log"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_opera_log"."username" IS '用户名';
COMMENT ON COLUMN "public"."sys_opera_log"."method" IS '请求类型';
COMMENT ON COLUMN "public"."sys_opera_log"."title" IS '操作模块';
COMMENT ON COLUMN "public"."sys_opera_log"."path" IS '请求路径';
COMMENT ON COLUMN "public"."sys_opera_log"."ip" IS 'IP地址';
COMMENT ON COLUMN "public"."sys_opera_log"."country" IS '国家';
COMMENT ON COLUMN "public"."sys_opera_log"."region" IS '地区';
COMMENT ON COLUMN "public"."sys_opera_log"."city" IS '城市';
COMMENT ON COLUMN "public"."sys_opera_log"."user_agent" IS '请求头';
COMMENT ON COLUMN "public"."sys_opera_log"."os" IS '操作系统';
COMMENT ON COLUMN "public"."sys_opera_log"."browser" IS '浏览器';
COMMENT ON COLUMN "public"."sys_opera_log"."device" IS '设备';
COMMENT ON COLUMN "public"."sys_opera_log"."args" IS '请求参数';
COMMENT ON COLUMN "public"."sys_opera_log"."status" IS '操作状态（0异常 1正常）';
COMMENT ON COLUMN "public"."sys_opera_log"."code" IS '操作状态码';
COMMENT ON COLUMN "public"."sys_opera_log"."msg" IS '提示消息';
COMMENT ON COLUMN "public"."sys_opera_log"."cost_time" IS '请求耗时ms';
COMMENT ON COLUMN "public"."sys_opera_log"."opera_time" IS '操作时间';
COMMENT ON COLUMN "public"."sys_opera_log"."created_time" IS '创建时间';

-- ----------------------------
-- Records of sys_opera_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
CREATE TABLE "public"."sys_role" (
                                     "id" int4 NOT NULL DEFAULT nextval('sys_role_id_seq'::regclass),
                                     "name" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                     "data_scope" int4,
                                     "status" int4 NOT NULL,
                                     "remark" text COLLATE "pg_catalog"."default",
                                     "created_time" timestamp(6) NOT NULL,
                                     "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_role"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_role"."name" IS '角色名称';
COMMENT ON COLUMN "public"."sys_role"."data_scope" IS '权限范围（1：全部数据权限 2：自定义数据权限）';
COMMENT ON COLUMN "public"."sys_role"."status" IS '角色状态（0停用 1正常）';
COMMENT ON COLUMN "public"."sys_role"."remark" IS '备注';
COMMENT ON COLUMN "public"."sys_role"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_role"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO "public"."sys_role" VALUES (2, 'admin', 1, 1, '超级管理', '2024-03-18 11:31:50.764254', NULL);
INSERT INTO "public"."sys_role" VALUES (1, 'regular_admin', 2, 1, '普通管理员', '2024-03-18 10:51:30.983651', '2024-03-27 23:43:42.527915');
INSERT INTO "public"."sys_role" VALUES (6, 'llm_use', 2, 1, 'LLM使用者', '2024-04-07 10:34:08.937422', '2024-04-08 16:04:47.704942');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
CREATE TABLE "public"."sys_role_menu" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_role_menu_id_seq'::regclass),
                                          "role_id" int4 NOT NULL,
                                          "menu_id" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."sys_role_menu"."id" IS '主键ID';
COMMENT ON COLUMN "public"."sys_role_menu"."role_id" IS '角色ID';
COMMENT ON COLUMN "public"."sys_role_menu"."menu_id" IS '菜单ID';

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO "public"."sys_role_menu" VALUES (1, 2, 11);
INSERT INTO "public"."sys_role_menu" VALUES (2, 2, 12);
INSERT INTO "public"."sys_role_menu" VALUES (3, 2, 13);
INSERT INTO "public"."sys_role_menu" VALUES (4, 2, 14);
INSERT INTO "public"."sys_role_menu" VALUES (5, 2, 15);
INSERT INTO "public"."sys_role_menu" VALUES (6, 2, 16);
INSERT INTO "public"."sys_role_menu" VALUES (7, 2, 17);
INSERT INTO "public"."sys_role_menu" VALUES (8, 2, 18);
INSERT INTO "public"."sys_role_menu" VALUES (9, 2, 19);
INSERT INTO "public"."sys_role_menu" VALUES (10, 2, 20);
INSERT INTO "public"."sys_role_menu" VALUES (11, 2, 21);
INSERT INTO "public"."sys_role_menu" VALUES (12, 2, 22);
INSERT INTO "public"."sys_role_menu" VALUES (13, 2, 23);
INSERT INTO "public"."sys_role_menu" VALUES (14, 2, 24);
INSERT INTO "public"."sys_role_menu" VALUES (15, 2, 25);
INSERT INTO "public"."sys_role_menu" VALUES (16, 2, 2);
INSERT INTO "public"."sys_role_menu" VALUES (17, 2, 32);
INSERT INTO "public"."sys_role_menu" VALUES (18, 2, 26);
INSERT INTO "public"."sys_role_menu" VALUES (19, 2, 3);
INSERT INTO "public"."sys_role_menu" VALUES (20, 2, 27);
INSERT INTO "public"."sys_role_menu" VALUES (22, 2, 28);
INSERT INTO "public"."sys_role_menu" VALUES (24, 2, 29);
INSERT INTO "public"."sys_role_menu" VALUES (25, 2, 7);
INSERT INTO "public"."sys_role_menu" VALUES (26, 2, 30);
INSERT INTO "public"."sys_role_menu" VALUES (27, 2, 9);
INSERT INTO "public"."sys_role_menu" VALUES (28, 2, 31);
INSERT INTO "public"."sys_role_menu" VALUES (29, 2, 10);
INSERT INTO "public"."sys_role_menu" VALUES (30, 1, 32);
INSERT INTO "public"."sys_role_menu" VALUES (31, 1, 5);
INSERT INTO "public"."sys_role_menu" VALUES (32, 1, 6);
INSERT INTO "public"."sys_role_menu" VALUES (33, 1, 3);
INSERT INTO "public"."sys_role_menu" VALUES (34, 1, 30);
INSERT INTO "public"."sys_role_menu" VALUES (35, 1, 31);
INSERT INTO "public"."sys_role_menu" VALUES (37, 1, 2);
INSERT INTO "public"."sys_role_menu" VALUES (68, 2, 4);
INSERT INTO "public"."sys_role_menu" VALUES (69, 1, 4);
INSERT INTO "public"."sys_role_menu" VALUES (70, 2, 33);
INSERT INTO "public"."sys_role_menu" VALUES (71, 6, 33);
INSERT INTO "public"."sys_role_menu" VALUES (72, 6, 4);
INSERT INTO "public"."sys_role_menu" VALUES (73, 6, 2);
INSERT INTO "public"."sys_role_menu" VALUES (74, 6, 3);
INSERT INTO "public"."sys_role_menu" VALUES (75, 2, 34);
INSERT INTO "public"."sys_role_menu" VALUES (76, 6, 34);
INSERT INTO "public"."sys_role_menu" VALUES (77, 2, 35);
INSERT INTO "public"."sys_role_menu" VALUES (78, 6, 30);
INSERT INTO "public"."sys_role_menu" VALUES (81, 6, 5);
INSERT INTO "public"."sys_role_menu" VALUES (83, 6, 35);
INSERT INTO "public"."sys_role_menu" VALUES (86, 6, 36);
INSERT INTO "public"."sys_role_menu" VALUES (87, 2, 36);
INSERT INTO "public"."sys_role_menu" VALUES (91, 2, 44);
INSERT INTO "public"."sys_role_menu" VALUES (97, 2, 40);
INSERT INTO "public"."sys_role_menu" VALUES (98, 2, 41);
INSERT INTO "public"."sys_role_menu" VALUES (99, 2, 5);
INSERT INTO "public"."sys_role_menu" VALUES (100, 2, 6);
INSERT INTO "public"."sys_role_menu" VALUES (101, 2, 37);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
CREATE TABLE "public"."sys_user" (
                                     "id" int4 NOT NULL DEFAULT nextval('sys_user_id_seq'::regclass),
                                     "uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                     "username" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                     "nickname" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                     "password" varchar(255) COLLATE "pg_catalog"."default",
                                     "salt" varchar(5) COLLATE "pg_catalog"."default",
                                     "email" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                     "is_superuser" bool NOT NULL,
                                     "is_staff" bool NOT NULL,
                                     "status" int4 NOT NULL,
                                     "is_multi_login" bool NOT NULL,
                                     "avatar" varchar(255) COLLATE "pg_catalog"."default",
                                     "phone" varchar(50) COLLATE "pg_catalog"."default",
                                     "join_time" timestamp(6) NOT NULL,
                                     "last_login_time" timestamp(6),
                                     "dept_id" int4,
                                     "created_time" timestamp(6) NOT NULL,
                                     "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_user"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_user"."username" IS '用户名';
COMMENT ON COLUMN "public"."sys_user"."nickname" IS '昵称';
COMMENT ON COLUMN "public"."sys_user"."password" IS '密码';
COMMENT ON COLUMN "public"."sys_user"."salt" IS '加密盐';
COMMENT ON COLUMN "public"."sys_user"."email" IS '邮箱';
COMMENT ON COLUMN "public"."sys_user"."is_superuser" IS '超级权限(0否 1是)';
COMMENT ON COLUMN "public"."sys_user"."is_staff" IS '后台管理登陆(0否 1是)';
COMMENT ON COLUMN "public"."sys_user"."status" IS '用户账号状态(0停用 1正常)';
COMMENT ON COLUMN "public"."sys_user"."is_multi_login" IS '是否重复登陆(0否 1是)';
COMMENT ON COLUMN "public"."sys_user"."avatar" IS '头像';
COMMENT ON COLUMN "public"."sys_user"."phone" IS '手机号';
COMMENT ON COLUMN "public"."sys_user"."join_time" IS '注册时间';
COMMENT ON COLUMN "public"."sys_user"."last_login_time" IS '上次登录';
COMMENT ON COLUMN "public"."sys_user"."dept_id" IS '部门关联ID';
COMMENT ON COLUMN "public"."sys_user"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_user"."updated_time" IS '更新时间';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO "public"."sys_user" VALUES (22, '7f338a31-7a50-4482-8ea5-17754e318633', 'jack', 'jack', '$2b$12$21FYIVTfKzuH45nBEw.n0uj1xiI5fUunVKQSVrLSaZBozi9yDGYa6', 'ch2QN', '11asd@qq.com', 'f', 't', 1, 'f', NULL, 'tel:+86-134-5678-8765', '2024-03-28 14:00:54.3977', '2024-08-26 10:58:43.328603', 4, '2024-03-28 14:00:54.3977', '2024-08-26 10:58:43.329184');
INSERT INTO "public"."sys_user" VALUES (4, 'efa40974-e346-42f7-a9c0-a1a767ed2ed5', 'admin', 'admin', '$2b$12$UOdVBwvwtRNDpt3daiE8I.nUR97RCH9XQqJHxy.eMUen5tOAtkPNC', 'QtHDx', 'tuao@2p.com', 't', 't', 1, 't', 'https://qiniu.xxx.com/gogollm_ui/dev/avatar/avatar1.png', 'tel:+86-132-8885-8888', '2024-03-18 11:41:18.919147', '2024-08-26 11:04:16.728026', 6, '2024-03-18 11:41:18.919147', '2024-08-26 11:04:16.728825');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
CREATE TABLE "public"."sys_user_role" (
                                          "id" int4 NOT NULL DEFAULT nextval('sys_user_role_id_seq'::regclass),
                                          "user_id" int4 NOT NULL,
                                          "role_id" int4 NOT NULL
)
;
COMMENT ON COLUMN "public"."sys_user_role"."id" IS '主键ID';
COMMENT ON COLUMN "public"."sys_user_role"."user_id" IS '用户ID';
COMMENT ON COLUMN "public"."sys_user_role"."role_id" IS '角色ID';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO "public"."sys_user_role" VALUES (1, 4, 2);
INSERT INTO "public"."sys_user_role" VALUES (34, 22, 6);

-- ----------------------------
-- Table structure for sys_user_social
-- ----------------------------
CREATE TABLE "public"."sys_user_social" (
                                            "id" int4 NOT NULL DEFAULT nextval('sys_user_social_id_seq'::regclass),
                                            "source" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
                                            "open_id" varchar(20) COLLATE "pg_catalog"."default",
                                            "uid" varchar(20) COLLATE "pg_catalog"."default",
                                            "union_id" varchar(20) COLLATE "pg_catalog"."default",
                                            "scope" varchar(120) COLLATE "pg_catalog"."default",
                                            "code" varchar(50) COLLATE "pg_catalog"."default",
                                            "user_id" int4,
                                            "created_time" timestamp(6) NOT NULL,
                                            "updated_time" timestamp(6)
)
;
COMMENT ON COLUMN "public"."sys_user_social"."id" IS '主键id';
COMMENT ON COLUMN "public"."sys_user_social"."source" IS '第三方用户来源';
COMMENT ON COLUMN "public"."sys_user_social"."open_id" IS '第三方用户的 open id';
COMMENT ON COLUMN "public"."sys_user_social"."uid" IS '第三方用户的 ID';
COMMENT ON COLUMN "public"."sys_user_social"."union_id" IS '第三方用户的 union id';
COMMENT ON COLUMN "public"."sys_user_social"."scope" IS '第三方用户授予的权限';
COMMENT ON COLUMN "public"."sys_user_social"."code" IS '用户的授权 code';
COMMENT ON COLUMN "public"."sys_user_social"."user_id" IS '用户关联ID';
COMMENT ON COLUMN "public"."sys_user_social"."created_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_user_social"."updated_time" IS '更新时间';

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_app_dept_id_seq"
    OWNED BY "public"."ggl_app_dept"."id";
SELECT setval('"public"."ggl_app_dept_id_seq"', 63, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_app_id_seq"
    OWNED BY "public"."ggl_app"."id";
SELECT setval('"public"."ggl_app_id_seq"', 61, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_chat_history_id_seq"
    OWNED BY "public"."ggl_chat_history"."id";
SELECT setval('"public"."ggl_chat_history_id_seq"', 1792, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_chat_session_id_seq"
    OWNED BY "public"."ggl_chat_session"."id";
SELECT setval('"public"."ggl_chat_session_id_seq"', 517, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_dir_dept_id_seq"
    OWNED BY "public"."ggl_dir_dept"."id";
SELECT setval('"public"."ggl_dir_dept_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_dir_id_seq"
    OWNED BY "public"."ggl_dir"."id";
SELECT setval('"public"."ggl_dir_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_doc_chunk_id_seq"
    OWNED BY "public"."ggl_doc_chunk"."id";
SELECT setval('"public"."ggl_doc_chunk_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ggl_doc_id_seq"
    OWNED BY "public"."ggl_doc"."id";
SELECT setval('"public"."ggl_doc_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_api_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_casbin_rule_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_dept_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_dict_data_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_dict_type_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_login_log_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_menu_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_opera_log_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_role_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_role_menu_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_user_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_user_role_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
SELECT setval('"public"."sys_user_social_id_seq"', 1, false);

-- ----------------------------
-- Indexes structure for table ggl_app
-- ----------------------------
CREATE INDEX "ix_ggl_app_id" ON "public"."ggl_app" USING btree (
    "id" "pg_catalog"."int4_ops" ASC NULLS LAST
    );

-- ----------------------------
-- Primary Key structure for table ggl_app
-- ----------------------------
ALTER TABLE "public"."ggl_app" ADD CONSTRAINT "ggl_app_pkey" PRIMARY KEY ("id");
