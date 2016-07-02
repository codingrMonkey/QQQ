package test;

import java.util.concurrent.atomic.AtomicInteger;

public class UTest {
	private final int threadLocalHashCode = nextHashCode();

	private static final int HASH_INCREMENT = 0x61c88647;
	private static AtomicInteger nextHashCode = new AtomicInteger();

	public static void main(String[] args) throws Exception {
		System.out.println("main thread");
		UTest u1 = new UTest();
		System.out.println(u1.threadLocalHashCode);
		UTest u2 = new UTest();
		System.out.println(u2.threadLocalHashCode);
	}

	private static int nextHashCode() {
		System.out.println("invoked once");
		return nextHashCode.getAndAdd(HASH_INCREMENT);
	}
}
