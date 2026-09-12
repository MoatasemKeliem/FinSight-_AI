using System;

namespace finsight_ai.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }

}
