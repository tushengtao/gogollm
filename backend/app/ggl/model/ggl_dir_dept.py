from sqlalchemy import INT, Column, ForeignKey, Integer, Table

from backend.common.msd.model import MappedBase

ggl_dir_dept = Table(
    'ggl_dir_dept',
    MappedBase.metadata,
    Column('id', INT, primary_key=True, unique=True, index=True, autoincrement=True, comment='主键ID'),
    Column('dir_id', Integer, ForeignKey('ggl_dir.id'), primary_key=True, comment='目录ID'),
    Column('dept_id', Integer, ForeignKey('sys_dept.id'), primary_key=True, comment='部门ID')
)
