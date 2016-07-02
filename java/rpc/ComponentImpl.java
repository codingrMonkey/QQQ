package rpc;

public class ComponentImpl implements Component{
	@Override
	public String doSomething(String params) {
		System.out.println("server get the param = " + params);
		System.out.println("execute do Something method");
		return "get params is ==  " + params + " OK";
	}
}
