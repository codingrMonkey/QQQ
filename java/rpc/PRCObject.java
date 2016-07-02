package rpc;

import java.io.Serializable;

public class PRCObject implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String classQufiedName;
	private String methodName;
	private Object[] params;
	public String getClassQufiedName() {
		return classQufiedName;
	}
	public void setClassQufiedName(String classQufiedName) {
		this.classQufiedName = classQufiedName;
	}
	public String getMethodName() {
		return methodName;
	}
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	public Object[] getParams() {
		return params;
	}
	public void setParams(Object[] params) {
		this.params = params;
	}
}
