import sys
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TCollection import TCollection_ExtendedString, TCollection_AsciiString
from OCP.TDF import TDF_LabelSequence
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.RWGltf import RWGltf_CafWriter
from OCP.TColStd import TColStd_IndexedDataMapOfStringString
from OCP.Message import Message_ProgressRange
doc=TDocStd_Document(TCollection_ExtendedString("doc")); r=STEPCAFControl_Reader(); r.SetColorMode(True); r.SetNameMode(True)
r.ReadFile(sys.argv[1]); r.Transfer(doc)
st=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main()); labs=TDF_LabelSequence(); st.GetFreeShapes(labs)
for i in range(1,labs.Length()+1): BRepMesh_IncrementalMesh(st.GetShape_s(labs.Value(i)),float(sys.argv[3]) if len(sys.argv)>3 else 0.25,False,0.4,True)
w=RWGltf_CafWriter(TCollection_AsciiString(sys.argv[2]),True)
w.Perform(doc,TColStd_IndexedDataMapOfStringString(),Message_ProgressRange()); print('ok',sys.argv[2])
