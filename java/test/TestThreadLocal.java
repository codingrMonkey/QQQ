package test;

import java.text.SimpleDateFormat;

public class TestThreadLocal {
	public static ThreadLocal<SimpleDateFormat> threadLocal = new ThreadLocal<SimpleDateFormat>();
	public static void main(String[] args) {
		for(int i=0;i<10;i++){
			new Thread(new TLock()).start();
		}
	}
	public static SimpleDateFormat get(){
		//System.out.println(Thread.currentThread().getName());
		if(threadLocal.get() == null){
			System.out.println("exe init();");
			threadLocal.set(new SimpleDateFormat("yyyyMMdd"));
		}
		SimpleDateFormat sdf = threadLocal.get();
		System.out.println(sdf);
		return sdf;
	}
}
class TLock implements Runnable{
	@Override
	public void run() {
		TestThreadLocal.get();
	}
}
