from sqlalchemy import INT, Column, ForeignKey, Integer, Table

from backend.common.msd.model import MappedBase

ggl_app_dept = Table(
    'ggl_app_dept',
    MappedBase.metadata,
    Column('id', INT, primary_key=True, unique=True, index=True, autoincrement=True, comment='主键ID'),
    Column('app_id', Integer, ForeignKey('ggl_app.id'), primary_key=True, comment='应用ID'),
    Column('dept_id', Integer, ForeignKey('sys_dept.id'), primary_key=True, comment='部门ID')
)
